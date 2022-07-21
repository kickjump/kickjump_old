import { CSRF_HEADER_KEY } from '@kickjump/svelte-auth/client';
import type { UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@sveltestack/svelte-query';
import {
  type FetchInfiniteQueryOptions,
  type FetchQueryOptions,
  type InfiniteData,
  type InvalidateOptions,
  type InvalidateQueryFilters,
  type QueryClient,
  type RefetchOptions,
  type RefetchQueryFilters,
  type SetDataOptions,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@sveltestack/svelte-query';
import type { Updater } from '@sveltestack/svelte-query/dist/queryCore/core/utils.js';
import type { FlattenRouter } from '@trpc/client';
import {
  type CreateTRPCClientOptions,
  type TRPCClient,
  type TRPCClientError,
  type TRPCClientErrorLike,
  type TRPCRequestOptions,
  createTRPCClient,
  createTRPCClientProxy,
} from '@trpc/client';
import type {
  AnyRouter,
  inferHandlerInput,
  inferProcedureInput,
  inferProcedureOutput,
  inferProcedureParams,
  Procedure,
  ProcedureRouterRecord,
} from '@trpc/server';
import { createProxy } from '@trpc/server/shared';
import { isPromise } from 'is-what';
import { getContext, hasContext, setContext } from 'svelte';
import type { Readable } from 'svelte/store';
import invariant from 'tiny-invariant';

const CONTEXT_KEY = Symbol('$$trpc-context$$');

export class TRPCContext<Router extends AnyRouter = AnyRouter> {
  /**
   * Dynamically provide the context when accessed.
   */
  static context<Router extends AnyRouter>(): TRPCContext<Router> {
    const context = getContext<TRPCContext<Router> | undefined>(CONTEXT_KEY);
    invariant(context, 'TRPCContext compound components cannot be rendered outside the context');

    return context;
  }

  /**
   * Check if the context exists for the current component.
   */
  static has(): boolean {
    return hasContext(CONTEXT_KEY);
  }

  /**
   * Create a new context.
   */
  static create<Router extends AnyRouter>(props: TRPCContextProps<Router>): TRPCContext<Router> {
    const context = new TRPCContext(props);
    setContext<TRPCContext<Router>>(CONTEXT_KEY, context);

    return context;
  }

  readonly proxy: FlattenRouter<Router>;
  readonly client: TRPCClient<Router>;
  readonly queryClient: QueryClient;
  readonly ssrState: SSRState | undefined;

  get #client(): TRPCClient<AnyRouter> {
    return this.client;
  }

  private constructor(props: TRPCContextProps<Router>) {
    this.client = props.client;
    this.queryClient = props.queryClient;
    this.ssrState = props.ssrState;
    this.proxy = createTRPCClientProxy<Router>(props.client);
  }

  fetchQuery = <
    Path extends keyof Router['_def']['queries'] & string,
    Procedure extends Router['_def']['queries'][Path],
    Output extends inferProcedureOutput<Procedure>,
    Input extends inferProcedureInput<Procedure>,
  >(
    pathAndInput: [path: Path, ...args: inferHandlerInput<Procedure>],
    options: TRPCFetchQueryOptions<Input, TRPCClientError<Router>, Output>,
  ): Promise<Output> => {
    return this.queryClient.fetchQuery(pathAndInput, () =>
      this.#client.query(...getClientArgs(pathAndInput, options)),
    );
  };

  fetchInfiniteQuery = <
    Path extends keyof Router['_def']['queries'] & string,
    Procedure extends Router['_def']['queries'][Path],
    Output extends inferProcedureOutput<Procedure>,
    Input extends inferProcedureInput<Procedure>,
  >(
    pathAndInput: [path: Path, ...args: inferHandlerInput<Procedure>],
    options?: TRPCFetchInfiniteQueryOptions<Input, TRPCClientError<Router>, Output>,
  ): Promise<InfiniteData<Output>> => {
    return this.queryClient.fetchInfiniteQuery(
      pathAndInput,
      ({ pageParam }) => {
        const [path, input] = pathAndInput;
        const actualInput = { ...input, cursor: pageParam };
        return this.#client.query(...getClientArgs([path, actualInput], options));
      },
      options,
    );
  };

  prefetchQuery = <
    Path extends keyof Router['_def']['queries'] & string,
    Procedure extends Router['_def']['queries'][Path],
    Output extends inferProcedureOutput<Procedure>,
    Input extends inferProcedureInput<Procedure>,
  >(
    pathAndInput: [path: Path, ...args: inferHandlerInput<Procedure>],
    options?: TRPCFetchQueryOptions<Input, TRPCClientError<Router>, Output>,
  ): Promise<void> => {
    return this.queryClient.prefetchQuery(
      pathAndInput,
      () => this.#client.query(...getClientArgs(pathAndInput, options)),
      options,
    );
  };

  prefetchInfiniteQuery = <
    Path extends keyof Router['_def']['queries'] & string,
    Procedure extends Router['_def']['queries'][Path],
    Output extends inferProcedureOutput<Procedure>,
    Input extends inferProcedureInput<Procedure>,
  >(
    pathAndInput: [path: Path, ...args: inferHandlerInput<Procedure>],
    options?: TRPCFetchInfiniteQueryOptions<Input, TRPCClientError<Router>, Output>,
  ): Promise<void> => {
    return this.queryClient.prefetchInfiniteQuery(
      pathAndInput,
      ({ pageParam }) => {
        const [path, input] = pathAndInput;
        const actualInput = { ...(input as any), cursor: pageParam };
        return this.#client.query(...getClientArgs([path, actualInput], options));
      },
      options,
    );
  };

  invalidateQueries<
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput?: [Path, Input?] | Path,
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions,
  ): Promise<void>;
  invalidateQueries(filters?: InvalidateQueryFilters, options?: InvalidateOptions): Promise<void>;
  invalidateQueries(pathAndInput: any, filters?: any, options?: InvalidateOptions) {
    return this.queryClient.invalidateQueries(pathAndInput, filters, options);
  }

  refetchQueries<
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput: [Path, Input?],
    filters?: RefetchQueryFilters,
    options?: RefetchOptions,
  ): Promise<void>;
  refetchQueries(filters?: RefetchQueryFilters, options?: RefetchOptions): Promise<void>;
  refetchQueries(pathAndInput: any, filters: any, options?: any) {
    return this.queryClient.refetchQueries(pathAndInput, filters, options);
  }

  cancelQuery = <
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput: [Path, Input?],
  ): Promise<void> => this.queryClient.cancelQueries(pathAndInput);

  setQueryData = <
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
    Output extends inferProcedureOutput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput: [Path, Input?],
    updater: Updater<Output | undefined, Output>,
    options?: SetDataOptions,
  ): void => this.queryClient.setQueryData(pathAndInput, updater, options);
  getQueryData = <
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
    Output extends inferProcedureOutput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput: [Path, Input?],
  ): Output | undefined => this.queryClient.getQueryData(pathAndInput);
  setInfiniteQueryData = <
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
    Output extends inferProcedureOutput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput: [Path, Input?],
    updater: Updater<InfiniteData<Output> | undefined, InfiniteData<Output>>,
    options?: SetDataOptions,
  ) => this.queryClient.setQueriesData(pathAndInput, updater, options);
  getInfiniteQueryData = <
    Path extends keyof Router['_def']['queries'] & string,
    Input extends inferProcedureInput<Router['_def']['queries'][Path]>,
    Output extends inferProcedureOutput<Router['_def']['queries'][Path]>,
  >(
    pathAndInput: [Path, Input?],
  ): InfiniteData<Output> | undefined => this.queryClient.getQueryData(pathAndInput);
}

interface TRPCContextProps<Router extends AnyRouter> {
  client: TRPCClient<Router>;
  queryClient: QueryClient;
  ssrState?: SSRState | undefined;
}

interface TRPCFetchQueryOptions<Input, Error, Output>
  extends FetchQueryOptions<Input, Error, Output>,
    TRPCRequestOptions {}
export interface TRPCUseQueryBaseOptions extends TRPCRequestOptions {
  /**
   * Opt out of SSR for this query by passing `ssr: false`
   */
  ssr?: boolean;
}
export interface UseTRPCQueryOptions<Path, Input, Output, Data, Error>
  extends UseQueryOptions<Output, Error, Data, [Path, Input]>,
    TRPCUseQueryBaseOptions {}

export interface UseTRPCMutationOptions<Input, Error, Output, Context = unknown>
  extends UseMutationOptions<Output, Error, Input, Context>,
    TRPCUseQueryBaseOptions {}

interface TRPCFetchInfiniteQueryOptions<Input, Error, Output>
  extends FetchInfiniteQueryOptions<Input, Error, Output>,
    TRPCRequestOptions {}

function getClientArgs(pathAndInput: [string, ...unknown[]], options: any) {
  const [path, input] = pathAndInput;
  return [path, input, options] as const;
}

export type ProcedureRecord = Record<string, Procedure<any>>;

type inferProcedures<Type extends ProcedureRecord> = {
  [Path in keyof Type]: {
    input: inferProcedureInput<Type[Path]>;
    output: inferProcedureOutput<Type[Path]>;
  };
};

export type SSRState = false | 'prepass' | 'mounting' | 'mounted';

export function createSvelteQueryTRPC<Router extends AnyRouter>() {
  type Queries = Router['_def']['queries'];
  // type TSubscriptions = Router['_def']['subscriptions'];
  type Error = TRPCClientErrorLike<Router>;
  type InfiniteQueryNames = inferInfiniteQueryNames<Queries>;
  type TQueryValues = inferProcedures<Router['_def']['queries']>;
  type TMutationValues = inferProcedures<Router['_def']['mutations']>;

  function createClient(options: CreateTRPCClientOptions<Router> & { csrf: string }) {
    const { csrf, ...rest } = options;
    return createTRPCClient<Router>({
      ...rest,
      headers: () => {
        const headers = { [CSRF_HEADER_KEY]: csrf };
        const value =
          typeof options.headers === 'function'
            ? options.headers()
            : typeof options.headers === 'object'
            ? options.headers
            : {};
        return isPromise(value)
          ? value.then((val) => ({ ...val, ...headers }))
          : { ...value, ...headers };
      },
    });
  }

  function context() {
    return TRPCContext.context<Router>();
  }

  /**
   * Hack to make sure errors return `status`='error` when doing SSR
   * @link https://github.com/trpc/trpc/pull/1645
   */
  function queryOptionsIfNeeded<Options extends { retryOnMount?: boolean } | undefined>(
    pathAndInput: unknown[],
    options: Options,
  ): Options {
    const { queryClient, ssrState } = context();

    return ssrState &&
      ssrState !== 'mounted' &&
      // eslint-disable-next-line unicorn/prefer-array-some, unicorn/no-array-callback-reference
      queryClient.getQueryCache().find(pathAndInput)?.state.status === 'error'
      ? { retryOnMount: false, ...options }
      : options;
  }

  function query<
    Path extends keyof TQueryValues & string,
    QueryFnData = TQueryValues[Path]['output'],
    Data = TQueryValues[Path]['output'],
  >(
    pathAndInput: [path: Path, ...args: inferHandlerInput<Queries[Path]>],
    options?: UseTRPCQueryOptions<Path, TQueryValues[Path]['input'], QueryFnData, Data, Error>,
  ): Readable<UseQueryResult<Data, Error>> {
    const { client, ssrState, queryClient, prefetchQuery } = context();

    if (
      typeof window === 'undefined' &&
      ssrState === 'prepass' &&
      options?.ssr !== false &&
      options?.enabled !== false &&
      // eslint-disable-next-line unicorn/prefer-array-some, unicorn/no-array-callback-reference
      !queryClient.getQueryCache().find(pathAndInput)
    ) {
      void prefetchQuery(pathAndInput, options as any);
    }

    const actualOptions = queryOptionsIfNeeded(pathAndInput, options);

    return useQuery(
      pathAndInput as any,
      () => (client as any).query(...getClientArgs(pathAndInput, actualOptions)),
      actualOptions,
    ) as any;
  }

  function mutation<Path extends keyof TMutationValues & string, Context = unknown>(
    path: Path | [Path],
    options?: UseTRPCMutationOptions<
      TMutationValues[Path]['input'],
      Error,
      TMutationValues[Path]['output'],
      Context
    >,
  ): UseMutationResult<
    TMutationValues[Path]['output'],
    Error,
    TMutationValues[Path]['input'],
    Context
  > {
    const { client } = context();

    return useMutation((input) => {
      const actualPath = Array.isArray(path) ? path[0] : path;
      return (client.mutation as any)(actualPath, input, options);
    }, options) as any;
  }

  function infiniteQuery<Path extends InfiniteQueryNames & string>(
    pathAndInput: [path: Path, input: Omit<TQueryValues[Path]['input'], 'cursor'>],
    opts?: UseTRPCInfiniteQueryOptions<
      Path,
      Omit<TQueryValues[Path]['input'], 'cursor'>,
      TQueryValues[Path]['output'],
      Error
    >,
  ): UseInfiniteQueryResult<TQueryValues[Path]['output'], Error> {
    const [path, input] = pathAndInput;
    const { client, ssrState, prefetchInfiniteQuery, queryClient } = context();

    if (
      typeof window === 'undefined' &&
      ssrState === 'prepass' &&
      opts?.ssr !== false &&
      opts?.enabled !== false &&
      // eslint-disable-next-line unicorn/prefer-array-some, unicorn/no-array-callback-reference
      !queryClient.getQueryCache().find(pathAndInput)
    ) {
      void prefetchInfiniteQuery(pathAndInput as any, opts as any);
    }

    const actualOptions = queryOptionsIfNeeded(pathAndInput, opts);

    return useInfiniteQuery(
      pathAndInput as any,
      ({ pageParam }) => {
        const actualInput = { ...input, cursor: pageParam };
        return (client.query as any)(...getClientArgs([path, actualInput], actualOptions));
      },
      actualOptions,
    ) as any;
  }

  return { createClient, context, query, mutation, infiniteQuery };
}

/**
 * Hack to infer the type of `createSvelteQueryTRPC`
 * @link https://stackoverflow.com/a/59072991
 */
class GnClass<Router extends AnyRouter> {
  createSvelteQueryTRPC() {
    return createSvelteQueryTRPC<Router>();
  }
}

export interface UseTRPCInfiniteQueryOptions<Path, Input, Output, Error>
  extends UseInfiniteQueryOptions<Output, Error, Output, Output, [Path, Input]>,
    TRPCUseQueryBaseOptions {}

type inferInfiniteQueryNames<Type extends ProcedureRecord> = {
  [Path in keyof Type]: inferProcedureInput<Type[Path]> extends {
    cursor?: any;
  }
    ? Path
    : never;
}[keyof Type];
type returnTypeInferer<T> = T extends (a: Record<string, string>) => infer U ? U : never;
type HackyInferrer<Router extends AnyRouter> = GnClass<Router>['createSvelteQueryTRPC'];
type CreateSvelteQueryTRPC<Router extends AnyRouter> = returnTypeInferer<HackyInferrer<Router>>;

export function createSvelteQueryTRPCProxy<Router extends AnyRouter>(
  trpc: CreateSvelteQueryTRPC<Router>,
) {
  const proxy = createProxy((opts) => {
    const args = opts.args;
    const pathCopy = [...opts.path];

    // The last arg is for instance `.useMutation` or `.useQuery()`
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastArg = pathCopy.pop()!;

    // The `path` ends up being something like `post.byId`
    const path = pathCopy.join('.');

    if (lastArg === 'useMutation') {
      return (trpc as any)[lastArg](path, ...args);
    }

    const [input, ...rest] = args;

    return (trpc as any)[lastArg]([path, input], ...rest);
  });

  return proxy as DecoratedProcedureRecord<Router['_def']['record']>;
}

type inferProcedureClientError<T extends AnyProcedure> =
  inferProcedureParams<T>['_config']['errorShape'];

type NeverKeys<T> = {
  [TKey in keyof T]: T[TKey] extends never ? TKey : never;
}[keyof T];
type OmitNeverKeys<T> = Omit<T, NeverKeys<T>>;

type DecorateProcedure<Procedure extends AnyProcedure, Path extends string> = OmitNeverKeys<{
  query: Procedure extends { _query: true }
    ? <QueryFnData = inferProcedureOutput<Procedure>, Data = inferProcedureOutput<Procedure>>(
        ...args: [
          inferProcedureInput<Procedure>,
          void | UseTRPCQueryOptions<
            Path,
            inferProcedureInput<Procedure>,
            QueryFnData,
            Data,
            inferProcedureClientError<Procedure>
          >,
        ]
      ) => Readable<UseQueryResult<Data, inferProcedureClientError<Procedure>>>
    : never;

  mutation: Procedure extends { _mutation: true }
    ? <Context = unknown>(
        opts?: UseTRPCMutationOptions<
          inferProcedureInput<Procedure>,
          inferProcedureClientError<Procedure>,
          inferProcedureOutput<Procedure>,
          Context
        >,
      ) => Readable<
        UseMutationResult<
          inferProcedureOutput<Procedure>,
          inferProcedureClientError<Procedure>,
          inferProcedureInput<Procedure>,
          Context
        >
      >
    : never;

  infiniteQuery: Procedure extends { _query: true }
    ? inferProcedureInput<Procedure> extends {
        cursor?: any;
      }
      ? // eslint-disable-next-line @typescript-eslint/naming-convention
        <_QueryFnData = inferProcedureOutput<Procedure>, Data = inferProcedureOutput<Procedure>>(
          ...args: [
            Omit<inferProcedureInput<Procedure>, 'cursor'>,
            void | UseTRPCInfiniteQueryOptions<
              Path,
              inferProcedureInput<Procedure>,
              Data,
              inferProcedureClientError<Procedure>
            >,
          ]
        ) => Readable<UseInfiniteQueryResult<Data, inferProcedureClientError<Procedure>>>
      : never
    : never;
}>;

type assertProcedure<T> = T extends AnyProcedure ? T : never;

type DecoratedProcedureRecord<
  Procedures extends ProcedureRouterRecord,
  Path extends string = '',
> = {
  [TKey in keyof Procedures]: Procedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<Procedures[TKey]['_def']['record'], `${Path}${TKey & string}.`>
    : DecorateProcedure<assertProcedure<Procedures[TKey]>, `${Path}${TKey & string}`>;
};

type AnyProcedure = Procedure<any>;
