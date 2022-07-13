import type { Handle } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { TRPC_ENDPOINT } from '$lib/trpc';

import type { Context } from './init.js';
import { router } from './router/index.js';

/**
 * A function that creates a tRPC handle.
 * @see https://kit.svelte.dev/docs/hooks
 */
export function createTRPCHandle(): Handle {
  const endpoint = TRPC_ENDPOINT;

  return async function trpcHandler(props) {
    const { event, resolve } = props;

    if (!event.url.pathname.startsWith(`${endpoint}/`)) {
      return await resolve(event);
    }

    const { session } = event.locals;
    const createContext = (): Context => ({ session, user: session.data.user });
    const req = event.request;

    const response = await fetchRequestHandler({ req, endpoint, router, createContext });
    return response;
  };
}
