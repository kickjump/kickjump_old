/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { AccountProvider, OmittedKeys } from '../edgedb.js';
import { type AccountType, type EmailType, type UserType, e, run } from '../edgedb.js';

const USER_FIELDS = {
  ...e.User['*'],
  accounts: { provider: true, providerAccountId: true, id: true },
  emails: { ...e.Email['*'] },
} as const;

/**
 * Create a user with the provided data.
 */
export async function create(user: UserCreateInput, nested: NestedCreateOptions = {}) {
  const { emails = [], accounts = [] } = nested;
  const query = e.insert(e.User, { name: user.name, image: user.image });
  const { id } = await run(query);
  const emailQuery = linkEmailsQuery(id, emails);
  const accountQuery = linkAccountsQuery(id, accounts);
  await Promise.all([run(emailQuery), run(accountQuery)]);

  const populatedUserQuery = e.select(query, () => USER_FIELDS);
  const populatedUser = await run(populatedUserQuery);

  if (!populatedUser) {
    throw new Error('The user could not be created');
  }

  return populatedUser;
}

/**
 * Make this more robust in handling created projects.
 *
 * TODO(@ifiokjr) each published project and proposal should be handed to the
 * system user.
 */
export async function remove(id: string): Promise<void> {
  const query = e.delete(e.User, (user) => ({
    filter: e.op(user.id, '=', e.uuid(id)),
  }));

  await run(query);
}

export async function findAccountsByUserId(id: string, provider: AccountProvider) {
  const query = e.select(e.Account, (account) => ({
    ...e.Account['*'],
    filter: e.op(
      e.op(account.provider, '=', e.cast(e.AccountProvider, provider)),
      'and',
      e.op(account.user.id, '=', e.uuid(id)),
    ),
  }));

  return await run(query);
}

/**
 * Get the populated user from their email address.
 */
export async function findByEmail(email: string): Promise<PopulatedUser | undefined> {
  const query = e.select(e.Email, (item) => ({
    user: USER_FIELDS,
    filter: e.op(item.email, '=', email),
  }));

  const result = await run(query);

  if (!result) {
    return;
  }

  return result.user;
}

/**
 * Get a user by the `provider` and `providerAccountId`
 */
export async function findByAccount({
  provider,
  providerAccountId,
}: GetByAccountProps): Promise<PopulatedUser | undefined> {
  const query = e
    .select(e.Account, (item) => ({
      user: USER_FIELDS,
      filter: e.op(
        e.op(item.provider, '=', e.cast(e.AccountProvider, provider)),
        'and',
        e.op(item.providerAccountId, '=', providerAccountId),
      ),
    }))
    .assert_single();

  const result = await run(query);

  if (!result) {
    return;
  }

  return result.user;
}

function userQuery(user: UserCreateInput) {
  return e.insert(e.User, { name: user.name, image: user.image });
}

type UserId = ReturnType<typeof userQuery> | string;

function linkAccountsQuery(user: UserId, accounts: AccountCreateInput[]) {
  return e.for(e.json_array_unpack(e.json(accounts)), (account) => {
    return e.insert(e.Account, {
      accountType: e.cast(e.str, account.accountType!),
      provider: e.cast(e.AccountProvider, account.provider!),
      providerAccountId: e.cast(e.str, account.providerAccountId!),
      accessToken: account.accessToken ? e.cast(e.str, account.accessToken) : undefined,
      refreshToken: account.refreshToken ? e.cast(e.str, account.refreshToken) : undefined,
      scope: account.scope ? e.cast(e.array(e.str), account.scope) : undefined,
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', typeof user === 'string' ? e.uuid(user) : user.id),
      })),
    });
  });
}

function linkEmailsQuery(user: UserId, emails: EmailCreateInput[]) {
  return e.for(e.json_array_unpack(e.json(emails)), (email) => {
    return e.insert(e.Email, {
      email: e.cast(e.str, email.email!),
      verified: email.verified ? e.datetime_current() : undefined,
      primary: e.cast(e.bool, email.primary!),
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', typeof user === 'string' ? e.uuid(user) : user.id),
      })),
    });
  });
}

/**
 * Link the provided accounts
 */
export async function linkAccount(userId: string, account: AccountCreateInput) {
  return run(linkAccountsQuery(userId, [account]));
}

interface GetByAccountProps {
  provider: AccountProvider;
  providerAccountId: string;
}
export type PopulatedUser = Awaited<ReturnType<typeof create>>;
export type EmailCreateInput = EmailType<{
  omit: OmittedKeys;
  replace: { verified: boolean };
  simplify: true;
}>;
export type AccountCreateInput = AccountType<{ omit: OmittedKeys; simplify: true }>;
export type UserCreateInput = UserType<{ omit: OmittedKeys; simplify: true }>;

interface NestedCreateOptions {
  emails?: EmailCreateInput[];
  accounts?: AccountCreateInput[];
}
