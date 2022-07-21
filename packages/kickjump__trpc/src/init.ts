import type { ServerSession } from '@kickjump/svelte-auth';
import { s, transformer } from '@kickjump/types';
import { initTRPC } from '@trpc/server';

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
