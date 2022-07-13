import type { ServerSession } from '@kickjump/svelte-auth';
import { initTRPC, TRPCError } from '@trpc/server';

import { transformer } from '$lib/transformer';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Context = {
  user?: App.User | undefined;
  session: ServerSession;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Meta = {
  description?: string;
};

interface Params {
  ctx: Context;
  meta: Meta;
}

export const t = initTRPC<Params>()({ transformer });

const isAuthenticated = t.middleware((props) => {
  const { next, ctx } = props;

  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'This procedure requires authentication to access',
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Reusable:
export const authenticated = t.procedure.use(isAuthenticated);
