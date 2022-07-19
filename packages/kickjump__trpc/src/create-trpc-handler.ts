import type * as _ from '@kickjump/svelte-auth';
import type { Handle } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import {} from '@kickjump/validation';
import { TRPC_ENDPOINT } from './client/index.js';
import { type Context, Env } from './init.js';
import { router } from './router/index.js';

/**
 * A function that creates a tRPC handle.
 *
 * @see https://kit.svelte.dev/docs/hooks
 */
export function createTRPCHandle(): Handle {
  const endpoint = TRPC_ENDPOINT;

  return async function trpcHandler(props) {
    const { event, resolve } = props;

    if (!event.url.pathname.startsWith(`${endpoint}/`)) {
      return resolve(event);
    }

    const { session } = event.locals;
    const createContext = (): Context => ({
      session,
      user: session.data.user,
      env: s.create(process.env, Env),
    });
    const req = event.request;

    return fetchRequestHandler({ req, endpoint, router, createContext });
  };
}
