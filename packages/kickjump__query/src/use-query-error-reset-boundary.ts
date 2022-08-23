import { getContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

export function useQueryErrorResetBoundary(): Writable<boolean> | undefined {
  return getContext(ERROR_RESET_BOUNDARY_CONTEXT);
}

export function createIsResetStore() {
  return writable(false);
}

export const ERROR_RESET_BOUNDARY_CONTEXT = '$svelte-query-error-reset-boundary$';
