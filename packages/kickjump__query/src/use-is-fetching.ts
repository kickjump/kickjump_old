import {
  type QueryFilters,
  type QueryKey,
  notifyManager,
  parseFilterArgs,
} from '@tanstack/query-core';
import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';

import { useQueryClient } from './use-query-client.js';

export function useIsFetching(filters?: QueryFilters): Readable<number>;
export function useIsFetching(queryKey?: QueryKey, filters?: QueryFilters): Readable<number>;
export function useIsFetching(
  arg1?: QueryKey | QueryFilters,
  arg2?: QueryFilters,
): Readable<number> {
  const [filters] = parseFilterArgs(arg1, arg2);
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  let isFetching = queryClient.isFetching(filters);

  return readable(isFetching, (set) => {
    return queryCache.subscribe(
      notifyManager.batchCalls(() => {
        const newIsFetching = queryClient.isFetching(filters);

        if (isFetching === newIsFetching) {
          return;
        }

        isFetching = newIsFetching;
        set(isFetching);
      }),
    );
  });
}
