import { UserModel } from '@kickjump/db';
import { describe, expect, it } from 'vitest';

describe('db', () => {
  it('can create a user', async () => {
    const user = await UserModel.create({
      name: 'Mighty Ducks',
      image: 'https://path.com/to/image.jpg',
    });

    expect(user.name).toBe('Mighty Ducks');
  });
});
