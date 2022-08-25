/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  AccountProvider,
  AccountUtils,
  CreateOmitKeys,
  EnumUnion,
  WithId,
} from '@kickjump/types';
import { type EmailUtils, UserUtils } from '@kickjump/types';
import { isArray, isString } from 'is-what';

import { client, e, run } from '../edgedb.js';

/**
 * Create a user with the provided data.
 */
export async function create(props: UserCreateInput): Promise<string> {
  const user = e.insert(e.User, { name: props.name, image: props.image, username: props.username });
  const emails = props.emails?.map((email) =>
    e.insert(e.Email, {
      email: email.email,
      user,
      primary: email.primary,
      verifiedAt: email.verified ? e.datetime_current() : undefined,
    }),
  );
  const accounts = props.accounts?.map((account) => e.insert(e.Account, { ...account, user }));

  const querySet = [user];

  if (emails) {
    (querySet as any[]).push(...emails);
  }

  if (accounts) {
    (querySet as any[]).push(...accounts);
  }

  const set = e.set(...querySet);
  const result = await run(set);
  const id = isArray(result) ? result.at(0)?.id : (result as Partial<WithId>)?.id;

  if (!id) {
    throw new Error('The user could not be created');
  }

  return id;
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
    ...UserUtils.FIELDS,
    filter: e.op(user.id, '=', e.uuid(id)),
  }));

  return query.run(client);
}

interface FindProviderAccountById {
  id: string;
  provider: EnumUnion<AccountProvider>;
}

export async function findProviderAccountById(props: FindProviderAccountById) {
  const { id, provider } = props;
  const query = e
    .select(e.Account, (account) => ({
      ...e.Account['*'],
      filter: e.op(
        e.op(account.provider, '=', e.cast(e.AccountProvider, provider)),
        'and',
        e.op(account.user.id, '=', e.uuid(id)),
      ),
    }))
    .assert_single();

  return await run(query);
}

/**
 * Get the populated user from their email address.
 */
export async function findByEmail(email: string): Promise<UserUtils.User | undefined> {
  const query = e.select(e.Email, (item) => ({
    user: UserUtils.FIELDS,
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
}: GetByAccountProps): Promise<UserUtils.User | undefined> {
  const query = e
    .select(e.Account, (item) => ({
      user: UserUtils.FIELDS,
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
      provider: e.cast(e.AccountProvider, account.provider!),
      providerAccountId: e.cast(e.str, account.providerAccountId!),
      accessToken: account.accessToken ? e.cast(e.str, account.accessToken) : undefined,
      refreshToken: account.refreshToken ? e.cast(e.str, account.refreshToken) : undefined,
      scope: account.scope ? e.cast(e.array(e.str), account.scope) : undefined,
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', isString(user) ? e.uuid(user) : user.id),
      })),
    });
  });
}

function linkEmailsQuery(user: UserId, emails: EmailCreateInput[]) {
  return e.for(e.json_array_unpack(e.json(emails)), (email) => {
    return e.insert(e.Email, {
      email: e.cast(e.str, email.email!),
      verifiedAt: email.verified ? e.datetime_current() : undefined,
      primary: e.cast(e.bool, email.primary!),
      user: e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', isString(user) ? e.uuid(user) : user.id),
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

export async function linkEmails(id: string, emails: EmailCreateInput[]) {
  const query = e.select(linkEmailsQuery(id, emails), () => ({
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
  provider: EnumUnion<AccountProvider>;
  providerAccountId: string;
}
export type EmailCreateInput = EmailUtils.Type<{
  omit: CreateOmitKeys;
  replace: { verified: boolean };
  simplify: true;
}>;
export type AccountCreateInput = AccountUtils.Type<{
  omit: CreateOmitKeys;
  simplify: true;
  replace: { provider: EnumUnion<AccountProvider> };
}>;
export type UserCreateInput = UserUtils.Type<{
  omit: CreateOmitKeys;
  simplify: true;
  replace: { emails?: EmailCreateInput[]; accounts?: AccountCreateInput[] };
}>;
