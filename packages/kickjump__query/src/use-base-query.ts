import { type QueryKey, type QueryObserver, notifyManager } from '@tanstack/query-core';
import { readable } from 'svelte/store';

import type { UseBaseQueryOptions } from './types.js';
import { useIsRestoring } from './use-is-restoring.js';
import { useQueryClient } from './use-query-client.js';

export function useBaseQuery<TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(
  options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  Observer: typeof QueryObserver,
) {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();
  const defaultedOptions = queryClient.defaultQueryOptions(options);

  // Make sure results are optimistically set in fetching state before subscribing or updating options
  defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic';

  // Include callbacks in batch renders
  if (defaultedOptions.onError) {
    defaultedOptions.onError = notifyManager.batchCalls(defaultedOptions.onError);
  }

  if (defaultedOptions.onSuccess) {
    defaultedOptions.onSuccess = notifyManager.batchCalls(defaultedOptions.onSuccess);
  }

  if (defaultedOptions.onSettled) {
    defaultedOptions.onSettled = notifyManager.batchCalls(defaultedOptions.onSettled);
  }

  if (
    defaultedOptions.suspense && // Always set stale time when using suspense to prevent
    // fetching again when directly mounting after suspending
    typeof defaultedOptions.staleTime !== 'number'
  ) {
    defaultedOptions.staleTime = 1000;
  }

  const observer = new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
    queryClient,
    defaultedOptions,
  );

  const query = readable(observer.getOptimisticResult(defaultedOptions), (set) => {
    return observer.subscribe(notifyManager.batchCalls(set));
  });

  // Handle result property usage tracking
  return query;
}
