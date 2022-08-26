import { UserModel } from '@kickjump/db';
import { isReservedOrProfanity, UserUtils } from '@kickjump/types';
import { TRPCError } from '@trpc/server';

import { t } from '../init.js';
import { authenticated, privateMiddleware } from '../middleware.js';
/**
 * The user procedure.
 */
export const user = t.router({
  /**
   * Get the full current user.
   */
  current: authenticated.query(async (props) => {
    const user = UserModel.findById(props.ctx.user.id);

    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
    }

    return user;
  }),
  /**
   * Create a new user.
   *
   * This cannot be accessed from the client (it will throw an error).
   */
  create: t.procedure
    .use(privateMiddleware)
    .input(UserUtils.createSchema({ username: checkUsername }))
    .mutation(async (props) => {
      const { input } = props;
      const user = await UserModel.create(input);
      return user;
    }),
});

async function checkUsername(username: string) {
  if (await isReservedOrProfanity(username)) {
    return false;
  }

  if (await UserModel.findByUsername(username)) {
    return false;
  }

  return true;
}
