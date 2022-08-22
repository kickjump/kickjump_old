export { type HydrateProps, Hydrate, useHydrate } from './hydrate.js';
export { IsRestoringProvider, useIsRestoring } from './is-restoring.js';
export type { QueryClientProviderProps } from './query-client-provider.js';
export { defaultContext, QueryClientProvider, useQueryClient } from './query-client-provider.js';
export type { QueryErrorResetBoundaryProps } from './query-error-reset-boundary.js';
export {
  QueryErrorResetBoundary,
  useQueryErrorResetBoundary,
} from './query-error-reset-boundary.js';
export * from './types.js';
export { useInfiniteQuery } from './use-infinite-query.js';
export { useIsFetching } from './use-is-fetching.js';
export { useIsMutating } from './use-is-mutating.js';
export { useMutation } from './use-mutation.js';
export { type QueriesOptions, type QueriesResults, useQueries } from './use-queries.js';
export { useQuery } from './use-query.js';

// Re-export core
export * from '@tanstack/query-core';
