import { createReactQueryHooks } from '@trpc/react';
import type { inferProcedureOutput } from '@trpc/server';

import type { AppRouter } from '~/server/app-router';

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const { useMutation, useQuery, useInfiniteQuery, useContext } =
  createReactQueryHooks<AppRouter>();

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type InferQueryOutput<RouteKey extends keyof AppRouter['_def']['queries']> =
  inferProcedureOutput<AppRouter['_def']['queries'][RouteKey]>;

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type InferMutationOutput<RouteKey extends keyof AppRouter['_def']['mutations']> =
  inferProcedureOutput<AppRouter['_def']['mutations'][RouteKey]>;
