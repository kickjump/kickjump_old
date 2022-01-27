import { describe, expect, it } from 'vitest';

import { prisma, UserModel } from '..';

describe('db', () => {
  it('can load prisma', () => {
    expect(prisma).toBeTruthy();
  });

  it('can create a user', async () => {
    const user = await UserModel.create('Test');
    expect(user.name).toBe('Test');
  });
});
