import { UserModel } from '@kickjump/db';
import type { ServerSession } from '@kickjump/svelte-auth';
import { initTRPC, TRPCError } from '@trpc/server';

import { s } from './client/index.js';
import { transformer } from './client/transformer.js';

export const Env = s.type({
  GITHUB_CLIENT_ID: s.string(),
  GITHUB_CLIENT_SECRET: s.string(),
  GITHUB_APP_NAME: s.string(),
  GITHUB_APP_ID: s.string(),
  GITHUB_APP_PRIVATE_KEY: s.string(),
  GITHUB_WEBHOOK_SECRET: s.string(),
});
type Env = s.Infer<typeof Env>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Context = {
  user?: App.User | undefined;
  session: ServerSession;
  env: Env;
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

export const withGitHubAccount = t.procedure.use(async (props) => {
  const { next, ctx } = props;

  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'This procedure requires authentication to access',
    });
  }

  const accounts = await UserModel.getAccountsByUserId(ctx.user.id, 'github');
  const account = accounts.at(0);

  if (!account?.accessToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing github account accessToken' });
  }

  return next({ ctx: { ...ctx, account } });
});
