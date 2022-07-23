/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { faker } from '@faker-js/faker';

import type { AccountType, EmailType, UserType } from './edgedb.js';
import { AccountProvider, client, e } from './edgedb.js';

type Account = AccountType<{
  omit: 'id';
  simplify: true;
}>;
type Email = EmailType<{ omit: 'id'; simplify: true }>;
type User = UserType<{ omit: 'id'; simplify: true }>;

function createAccount(): Account {
  return {
    accountType: 'oauth2',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    provider: AccountProvider.github,
    providerAccountId: faker.datatype.uuid(),
    scope: [],
  };
}

function createEmail(): Email {
  return {
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    verified: faker.date.recent(),
    primary: true,
    updatedAt: faker.date.recent(),
  };
}

// TODO(@ifiokjr) properly seed the project users
export function createUser(): User {
  const name = faker.name.findName();
  return {
    createdAt: faker.date.past(1),
    updatedAt: faker.date.recent(),
    image: faker.image.avatar(),
    name,
    username: faker.internet.userName(name),
  };
}

export async function seed() {
  const promises: Array<Promise<void>> = [];
  const accounts: Array<Account & { user: string }> = [];
  const emails: Array<Email & { user: string }> = [];

  for (const _ of '+'.repeat(10)) {
    const data = createUser();

    const promise = e
      .insert(e.User, {
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        image: data.image,
        username: data.username,
      })
      .run(client)
      .then((user) => {
        accounts.push({ ...createAccount(), user: user.id });
        emails.push({ ...createEmail(), user: user.id });
      });
    promises.push(promise);
  }

  await Promise.all(promises);

  await Promise.all([
    e
      .for(e.json_array_unpack(e.json(accounts)), (account) => {
        return e.insert(e.Account, {
          accountType: e.cast(e.str, account.accountType!),
          provider: e.cast(e.AccountProvider, account.provider!),
          providerAccountId: e.cast(e.str, account.providerAccountId!),
          createdAt: e.cast(e.datetime, account.createdAt!),
          updatedAt: e.cast(e.datetime, account.updatedAt!),
          user: e.select(e.User, (u) => ({
            filter: e.op(u.id, '=', e.cast(e.uuid, account.user!)),
          })),
        });
      })
      .run(client),
    e
      .for(e.json_array_unpack(e.json(emails)), (email) => {
        return e.insert(e.Email, {
          email: e.cast(e.str, email.email!),
          verified: e.cast(e.datetime, email.verified!),
          primary: e.cast(e.bool, email.primary!),
          createdAt: e.cast(e.datetime, email.createdAt!),
          updatedAt: e.cast(e.datetime, email.updatedAt!),
          user: e.select(e.User, (u) => ({ filter: e.op(u.id, '=', e.cast(e.uuid, email.user!)) })),
        });
      })
      .run(client),
  ]);
}
