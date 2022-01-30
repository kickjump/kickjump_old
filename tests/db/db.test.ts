import { prisma, UserModel } from '@kickjump/db';
import { describe, expect, it } from 'vitest';

describe('db', () => {
  it('can load prisma', () => {
    expect(prisma).toBeTruthy();
  });

  it('can create a user', async () => {
    const user = await UserModel.create('Test');
    expect(user.name).toBe('Test');
  });
});
