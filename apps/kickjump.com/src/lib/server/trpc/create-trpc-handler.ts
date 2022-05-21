import type { Handle } from '@sveltejs/kit';
import type { AnyRouter } from '@trpc/server';
import { type FetchHandlerOptions, fetchRequestHandler } from '@trpc/server/adapters/fetch';

type CreateTRPCHandleProps<Router extends AnyRouter> = FetchHandlerOptions<Router> & {
  /**
   * The URL prefix of tRPC routes.
   * Must start with `/` and NOT end with `/`.
   * Requests starting with this prefix will be intercepted and handled by tRPC,
   * and will NOT be forwarded to SvelteKit.
   * @default '/trpc' */
  endpoint?: string;

  /**
   * The tRPC router
   * @see https://trpc.io/docs/router */
  router: Router;
};

/**
 * A function that creates a tRPC handle.
 * @see https://kit.svelte.dev/docs/hooks
 */
export function createTRPCHandle<Router extends AnyRouter>(
  props: CreateTRPCHandleProps<Router>,
): Handle {
  const { endpoint = '/trpc', router, createContext, responseMeta, batching, onError } = props;

  if (!endpoint.startsWith('/') || endpoint.endsWith('/')) {
    throw new Error("The tRPC endpoint must start with '/' and NOT end with '/'");
  }

  return async function ({ event, resolve }) {
    if (event.url.pathname.startsWith(`${endpoint}/`)) {
      return fetchRequestHandler({
        req: event.request,
        router,
        endpoint,
        responseMeta,
        createContext,
        onError,
        batching,
      });
    }

    return await resolve(event);
  };
}
