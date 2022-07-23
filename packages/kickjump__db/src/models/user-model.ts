/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { AccountProvider, CreateOmitKeys } from '../edgedb.js';
import { type AccountType, type EmailType, type UserType, e, run } from '../edgedb.js';

const USER_FIELDS = {
  ...e.User['*'],
  accounts: { provider: true, providerAccountId: true, id: true },
  emails: { ...e.Email['*'] },
} as const;

/**
 * Create a user with the provided data.
 */
export async function create(props: UserCreateInput) {
  const user = e.insert(e.User, { name: props.name, image: props.image, username: props.username });
  const emails = (props.emails ?? []).map((email) =>
    e.insert(e.Email, {
      email: email.email,
      user,
      primary: email.primary,
      verified: email.verified ? e.datetime_current() : undefined,
    }),
  );
  const accounts = (props.accounts ?? []).map((account) =>
    e.insert(e.Account, { ...account, user }),
  );

  const set = e.set(user, ...emails, ...accounts);
  await run(set);
  const populatedUserQuery = e.select(e.User, (user) => ({
    ...USER_FIELDS,
    filter: e.op(user.username, '=', e.str(props.username)),
  }));
  const populatedUser = await run(populatedUserQuery);

  // const query = e.select(set.is(e.User), () => ({
  //   ...USER_FIELDS,
  //   filter: e.op(user.username, '=', e.str(props.username)),
  // })).assert_single()
  // const populatedUser = await run(query);

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
  await removeAll([id]);
}

export async function removeAll(ids: string[]): Promise<void> {
  const query = e.delete(e.User, (user) => ({
    filter: e.op(user.id, 'in', e.set(...ids.map((id) => e.uuid(id)))),
  }));

  await run(query);
}

export async function findById(id: string) {
  const query = e.select(e.User, (user) => ({
    ...USER_FIELDS,
    filter: e.op(user.id, '=', e.uuid(id)),
  }));

  return run(query);
}

export async function findAccountsByUserId(id: string, provider: keyof typeof AccountProvider) {
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
  return e.insert(e.User, { name: user.name, image: user.image, username: user.username });
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
export async function linkAccounts(userId: string, accounts: AccountCreateInput[]) {
  const query = e.select(linkAccountsQuery(userId, accounts), () => ({
    ...e.Account['*'],
    user: true,
  }));

  return run(query);
}

/**
 * Link the provided accounts
 */
export async function replaceAccount(
  userId: string,
  previousId: string,
  account: AccountCreateInput,
) {
  const deleteQuery = e.delete(e.Account, (account) => ({
    filter: e.op(account.id, '=', e.uuid(previousId)),
  }));

  await run(deleteQuery);

  const insertQuery = e.select(
    e.insert(e.Account, {
      ...account,
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', e.uuid(userId)),
      })),
    }),
    () => ({
      ...e.Account['*'],
      user: true,
    }),
  );

  return await run(insertQuery);
}

export async function linkEmails(userId: string, emails: EmailCreateInput[]) {
  const query = e.select(linkEmailsQuery(userId, emails), () => ({
    ...e.Email['*'],
    user: true,
  }));

  return run(query);
}

interface GetPermissionsProps {
  user: string;
  entity: string;
}

export async function findPermission(props: GetPermissionsProps) {
  const query = e
    .select(e.Membership, (membership) => ({
      permissions: true,
      actor: true,
      entity: true,
      filter: e.op(
        e.op(membership.entity.id, '=', e.uuid(props.entity)),
        'and',
        e.op(membership.actor.id, '=', e.uuid(props.user)),
      ),
    }))
    .assert_single();

  const permissions = await run(query);

  return permissions ?? undefined;
}

interface GetByAccountProps {
  provider: keyof typeof AccountProvider;
  providerAccountId: string;
}
export type PopulatedUser = Awaited<ReturnType<typeof create>>;
export type EmailCreateInput = EmailType<{
  omit: CreateOmitKeys;
  replace: { verified: boolean };
  simplify: true;
}>;
export type AccountCreateInput = AccountType<{
  omit: CreateOmitKeys;
  simplify: true;
  replace: { provider: keyof typeof AccountProvider };
}>;
export type UserCreateInput = UserType<{
  omit: CreateOmitKeys;
  simplify: true;
  replace: { emails?: EmailCreateInput[]; accounts?: AccountCreateInput[] };
}>;
