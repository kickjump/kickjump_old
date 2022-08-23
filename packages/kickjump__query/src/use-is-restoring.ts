import { getContext } from 'svelte';

export function useIsRestoring(): boolean {
  return getContext(IS_RESTORING_CONTEXT);
}

export const IS_RESTORING_CONTEXT = '$svelte-query-is-restoring$';
