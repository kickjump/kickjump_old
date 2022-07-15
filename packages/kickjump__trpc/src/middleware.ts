import { UserModel } from '@kickjump/db';
import type { ProcedureBuilder } from '@trpc/server';
import { TRPCError } from '@trpc/server';

import { t } from './init';

// Reusable:

export type InferProcedureContext<Builder extends AnyProcedureBuilder> =
  Builder extends ProcedureBuilder<infer T> ? T['_ctx_out'] : never;
type AnyProcedureBuilder = ProcedureBuilder<any>;

export const authenticated = t.procedure.use((props) => {
  const { next, ctx } = props;

  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'This procedure requires authentication to access',
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const withGitHubAccount = authenticated.use(async (props) => {
  const { next, ctx } = props;

  const accounts = await UserModel.getAccountsByUserId(ctx.user.id, 'github');
  const account = accounts.at(0);

  if (!account?.accessToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing github account accessToken' });
  }

  return next({ ctx: { ...ctx, account } });
});
