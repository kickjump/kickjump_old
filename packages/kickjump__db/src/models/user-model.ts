/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { AccountProvider } from '../edgedb.js';
import { type AccountType, type EmailType, type UserType, e, run } from '../edgedb.js';

const USER_DATA = {
  ...e.User['*'],
  accounts: { provider: true, providerAccountId: true },
  emails: { ...e.Email['*'] },
} as const;

export async function getAccountsByUserId(id: string, provider: string) {
  const query = e.select(e.User, (user) => ({
    accounts: e.select(e.Account, (account) => ({
      ...e.Account['*'],
      filter: e.op(account.provider, '=', e.cast(e.AccountProvider, provider)),
    })),
    filter: e.op(user.id, '=', e.uuid(id)),
  }));

  const result = await run(query);

  return result?.accounts ?? [];
}

/**
 * Get the populated user from their email address.
 */
export async function getByEmail(email: string): Promise<PopulatedUser | undefined> {
  const query = e.select(e.Email, (item) => ({
    user: USER_DATA,
    filter: e.op(item.email, '=', email),
  }));

  const result = await run(query);

  if (!result) {
    return;
  }

  return result.user;
}

interface GetByAccountProps {
  provider: AccountProvider;
  providerAccountId: string;
}

/**
 * Get a user by the `provider` and `providerAccountId`
 */
export async function getByAccount({ provider, providerAccountId }: GetByAccountProps) {
  const query = e.select(e.Account, (item) => ({
    user: USER_DATA,
    filter: e.op(
      e.op(item.provider, '=', e.cast(e.AccountProvider, provider)),
      'and',
      e.op(item.providerAccountId, '=', providerAccountId),
    ),
    // filter: e.op(item.providerAccountId, '=', providerAccountId),
  }));

  const result = await run(query);

  if (!result) {
    return;
  }

  const value = Array.isArray(result) ? result.at(0) : result;

  if (!value) {
    return;
  }

  return value.user;
}

export type PopulatedUser = NonNullable<Awaited<ReturnType<typeof getByAccount>>>;

type OmittedKeys = 'id' | 'createdAt' | 'updatedAt';
export type EmailCreateInput = EmailType<{
  omit: OmittedKeys | 'user';
  replace: { verified: boolean };
}>;
export type AccountCreateInput = AccountType<{ omit: OmittedKeys | 'user' }>;
export type UserCreateInput = UserType<{
  omit: OmittedKeys | 'accounts' | 'emails' | 'projectsCreated';
}>;
interface NestedCreateOptions {
  emails?: EmailCreateInput[];
  accounts?: AccountCreateInput[];
}

/**
 * Create a user with the provided data.
 */
export async function create(
  user: UserCreateInput,
  nested: NestedCreateOptions = {},
): Promise<PopulatedUser> {
  const newUser = await run(e.insert(e.User, { name: user.name, image: user.image }));
  const { emails = [], accounts = [] } = nested;
  const emailQuery = linkEmailsQuery(newUser.id, emails);
  const accountQuery = linkAccountsQuery(newUser.id, accounts);
  await Promise.all([run(emailQuery), run(accountQuery)]);

  const populatedUser =
    (await run(
      e.select(e.User, (user) => ({
        ...USER_DATA,
        filter: e.op(user.id, '=', e.uuid(newUser.id)),
      })),
    )) ?? undefined;

  if (!populatedUser) {
    throw new Error('The user could not created');
  }

  return populatedUser;
}

function linkAccountsQuery(userId: string, accounts: AccountCreateInput[]) {
  return e.for(e.json_array_unpack(e.json(accounts)), (account) => {
    return e.insert(e.Account, {
      accountType: e.cast(e.str, account.accountType!),
      provider: e.cast(e.AccountProvider, account.provider!),
      providerAccountId: e.cast(e.str, account.providerAccountId!),
      accessToken: account.accessToken ? e.cast(e.str, account.accessToken) : undefined,
      refreshToken: account.refreshToken ? e.cast(e.str, account.refreshToken) : undefined,
      scope: account.scope ? e.cast(e.array(e.str), account.scope) : undefined,
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', e.uuid(userId)),
      })),
    });
  });
}

function linkEmailsQuery(userId: string, emails: EmailCreateInput[]) {
  return e.for(e.json_array_unpack(e.json(emails)), (email) => {
    return e.insert(e.Email, {
      email: e.cast(e.str, email.email!),
      verified: email.verified ? e.datetime_current() : undefined,
      primary: e.cast(e.bool, email.primary!),
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', e.uuid(userId)),
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
