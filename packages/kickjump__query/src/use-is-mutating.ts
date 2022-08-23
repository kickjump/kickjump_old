import {
  type MutationFilters,
  type MutationKey,
  notifyManager,
  parseMutationFilterArgs,
} from '@tanstack/query-core';
import { type Readable, readable } from 'svelte/store';

import { useQueryClient } from './use-query-client.js';

export function useIsMutating(filters?: MutationFilters): Readable<number>;
export function useIsMutating(
  mutationKey?: MutationKey,
  filters?: Omit<MutationFilters, 'mutationKey'>,
): Readable<number>;
export function useIsMutating(
  arg1?: MutationKey | MutationFilters,
  arg2?: Omit<MutationFilters, 'mutationKey'>,
): Readable<number> {
  const [filters] = parseMutationFilterArgs(arg1, arg2);

  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  let isMutating = queryClient.isMutating(filters);

  return readable(isMutating, (set) => {
    return mutationCache.subscribe(
      notifyManager.batchCalls(() => {
        const newIisMutating = queryClient.isMutating(filters);

        if (isMutating === newIisMutating) {
          return;
        }

        isMutating = newIisMutating;
        set(isMutating);
      }),
    );
  });
}
