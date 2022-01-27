import { prisma } from '@kickjump/db';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (props: CreateNextContextOptions) => {
  const { req, res } = props;
  // for API-response caching see https://trpc.io/docs/caching
  return { req, res, prisma };
};

export type Context = inferAsyncReturnType<typeof createContext>;
