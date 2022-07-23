import type { ServerSession } from '@kickjump/svelte-auth';
import { transformer } from '@kickjump/types';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const Env = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_APP_NAME: z.string(),
  GITHUB_APP_ID: z.string(),
  GITHUB_APP_PRIVATE_KEY: z.string(),
  GITHUB_WEBHOOK_SECRET: z.string(),
});
type Env = z.infer<typeof Env>;

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
