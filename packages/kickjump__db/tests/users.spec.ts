import { afterAll, describe, expect, it } from 'vitest';

import { UserModel } from '../';

const users: Set<string> = new Set();

afterAll(async () => {
  await UserModel.removeAll([...users]);
});

describe('create', async () => {
  const user = {
    username: 'mighty_ducks',
    name: 'Mighty Ducks',
    image: 'https://path.com/to/image.jpg',
  };
  const userId = await UserModel.create(user);
  users.add(userId);

  it('can create a user', async () => {
    const retrieved = await UserModel.findById(userId);
    expect(retrieved?.accounts).toHaveLength(0);
    expect(retrieved?.name).toBe(user.name);
    expect(retrieved?.image).toBe(user.image);
  });

  it('can link emails', async () => {
    const email = { email: 'test@email.com', primary: true, verified: true };
    const emails = await UserModel.linkEmails(userId, [
      email,
      { email: 'name@awesome.com', verified: false, primary: false },
    ]);
    expect(emails.at(0)?.email).toEqual(email.email);
    expect(emails).toHaveLength(2);
    expect(emails.at(0)?.user.id).toEqual(userId);
  });

  it('can link accounts', async () => {
    const accounts = await UserModel.linkAccounts(userId, [
      {
        provider: 'github',
        providerAccountId: 'asdf',
        accessToken: 'asd',
        login: 'username',
        scope: ['email'],
        refreshToken: 'something here',
      },
    ]);
    const user = await UserModel.findById(userId);
    expect(accounts).toHaveLength(1);
    expect(user?.accounts.map((account) => account.id)).toEqual(
      accounts.map((account) => account.id),
    );
  });

  it('can create a user with accounts and emails in one shot', async () => {
    const userId = await UserModel.create({
      username: 'abc',
      emails: [{ email: 'abc@a.com', primary: true, verified: true }],
      accounts: [
        {
          provider: 'github',
          providerAccountId: 'sample',
          accessToken: 'sample',
          login: 'abc',
          refreshToken: 'sample',
          scope: ['user:email'],
        },
      ],
    });
    users.add(userId);

    const user = await UserModel.findById(userId);
    expect(user?.emails).toHaveLength(1);
    expect(user?.emails.at(0)?.email).toBe('abc@a.com');
    expect(user?.accounts).toHaveLength(1);
    expect(user?.accounts.at(0)?.provider).toBe('github');
  });
});
