import {
  type DehydratedState,
  type DehydrateOptions,
  type InfiniteData,
  dehydrate,
  QueryClient,
} from '@kickjump/query';
import {
  type AnyRouter,
  type ClientDataTransformerOptions,
  type inferHandlerInput,
  type inferProcedureOutput,
  type inferRouterContext,
  assertNotBrowser,
  callProcedure,
} from '@trpc/server';

type QueryClientConfig = ConstructorParameters<typeof QueryClient>[0];

assertNotBrowser();

export interface CreateSSGHelpersOptions<TRouter extends AnyRouter> {
  router: TRouter;
  ctx: inferRouterContext<TRouter>;
  transformer?: ClientDataTransformerOptions;
  queryClientConfig?: QueryClientConfig;
}

/**
 * Create functions you can use for server-side rendering / static generation
 */
export function createSSGHelpers<TRouter extends AnyRouter>({
  router,
  transformer,
  ctx,
  queryClientConfig,
}: CreateSSGHelpersOptions<TRouter>) {
  type TQueries = TRouter['_def']['queries'];
  const queryClient = new QueryClient(queryClientConfig);

  const serialize = transformer
    ? ('input' in transformer ? transformer.input : transformer).serialize
    : (obj: unknown) => obj;

  const prefetchQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ) => {
    return queryClient.prefetchQuery(pathAndInput, () => {
      return callProcedure({
        procedures: router._def.procedures,
        path: pathAndInput[0],
        rawInput: pathAndInput[1],
        ctx,
        type: 'query',
      });
    });
  };

  const prefetchInfiniteQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ) => {
    return queryClient.prefetchInfiniteQuery(pathAndInput, () => {
      return callProcedure({
        procedures: router._def.procedures,
        path: pathAndInput[0],
        rawInput: pathAndInput[1],
        ctx,
        type: 'query',
      });
    });
  };

  const fetchQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
    TOutput extends inferProcedureOutput<TProcedure>,
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ): Promise<TOutput> => {
    return queryClient.fetchQuery(pathAndInput, () => {
      return callProcedure({
        procedures: router._def.procedures,
        path: pathAndInput[0],
        rawInput: pathAndInput[1],
        ctx,
        type: 'query',
      });
    });
  };

  const fetchInfiniteQuery = async <
    TPath extends keyof TQueries & string,
    TProcedure extends TQueries[TPath],
    TOutput extends inferProcedureOutput<TProcedure>,
  >(
    ...pathAndInput: [path: TPath, ...args: inferHandlerInput<TProcedure>]
  ): Promise<InfiniteData<TOutput>> => {
    return queryClient.fetchInfiniteQuery(pathAndInput, () => {
      return callProcedure({
        procedures: router._def.procedures,
        path: pathAndInput[0],
        rawInput: pathAndInput[1],
        ctx,
        type: 'query',
      });
    });
  };

  function _dehydrate(options?: DehydrateOptions): DehydratedState {
    const before = dehydrate(queryClient, { shouldDehydrateQuery: () => true, ...options });
    const after = serialize(before);
    return after;
  }

  return {
    prefetchQuery,
    prefetchInfiniteQuery,
    fetchQuery,
    fetchInfiniteQuery,
    dehydrate: _dehydrate,
    queryClient,
  };
}

export type CreateSSGHelpers = ReturnType<typeof createSSGHelpers>;