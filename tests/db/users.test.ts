import { e, run, UserModel } from '@kickjump/db';
import { describe, expect, it } from 'vitest';

describe('create', () => {
  afterEach(async () => {
    // remove all users after each test
    await run(e.delete(e.User));
  });

  it('can create a user', async () => {
    const email = { email: 'test@email.com', primary: true, verified: true };
    const user = {
      name: 'Mighty Ducks',
      image: 'https://path.com/to/image.jpg',
    };

    const result = await UserModel.create(user, { emails: [email] });

    expect(result.emails).toHaveLength(1);
    expect(result.accounts).toHaveLength(0);
    expect(result.emails.at(0)?.email).toEqual(email.email);
    expect(result.name).toBe(user.name);
    expect(result.image).toBe(user.image);
  });
});
