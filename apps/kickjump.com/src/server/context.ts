import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (props: CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching
  return props;
};

export type Context = inferAsyncReturnType<typeof createContext>;
