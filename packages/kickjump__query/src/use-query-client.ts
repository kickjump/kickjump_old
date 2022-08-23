import type { QueryClient } from '@tanstack/query-core';
import { getContext } from 'svelte';

export const QUERY_CLIENT_CONTEXT = '$svelte-query-client$';

export function useQueryClient(): QueryClient {
  const queryClient: QueryClient = getContext(QUERY_CLIENT_CONTEXT);

  if (!queryClient) {
    throw new Error('No QueryClient set, use <QueryClientProvider /> to set one');
  }

  return queryClient;
}

// If we are given a context, we will use it. Otherwise, if contextSharing is
// on, we share the first and at least one instance of the context across the
// window to ensure that if React Query is used across different bundles or
// microfrontends they will all use the same **instance** of context, regardless
// of module scoping.
//
// TODO(@ifiokjr) how to do this in svelte so that all contexts can be locked to
// one parent
export function getQueryClient(_sharing: boolean) {}
