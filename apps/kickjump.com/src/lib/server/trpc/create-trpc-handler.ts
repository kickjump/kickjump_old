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
    console.log({ pathname: event.url.pathname });

    if (!event.url.pathname.startsWith(`${endpoint}/`)) {
      return await resolve(event);
    }

    const { session } = event.locals;
    const createContext = (): Context => ({ session, user: session.data.user });
    const req = event.request;

    console.log('fetching the request handler', event.url.href);
    const response = await fetchRequestHandler({ req, endpoint, router, createContext });
    console.log('done fetching!');
    return response;
  };
}
