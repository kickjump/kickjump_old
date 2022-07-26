/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { faker } from '@faker-js/faker';
import type { AccountUtils, EmailUtils, UserUtils } from '@kickjump/types';
import { AccountProvider } from '@kickjump/types';
import type { $ } from 'edgedb';

import { e, run } from './edgedb.js';

type Account = AccountUtils.Type<{
  omit: 'id';
  simplify: true;
}>;
type Email = EmailUtils.Type<{ omit: 'id'; simplify: true }>;
type User = UserUtils.Type<{ omit: 'id'; simplify: true }>;

function createAccount(): Account {
  return {
    accessToken: faker.datatype.hexadecimal().slice(2),
    refreshToken: faker.datatype.hexadecimal().slice(2),
    login: faker.internet.userName(),
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
  const expressions: [$.TypeSet, ...$.TypeSet[]] = [e.select(e.bool(false))];

  for (const _ of '+'.repeat(10)) {
    const userData = createUser();
    const emailData = createEmail();
    const accountData = createAccount();

    const user = e.insert(e.User, userData);
    const email = e.insert(e.Email, { ...emailData, user });
    const account = e.insert(e.Account, { ...accountData, user });
    expressions.push(e.set(user, email, account));
  }

  await run(e.set(...expressions), { unsafeIgnorePolicies: true });
}
