import { type Prisma, prisma } from '@kickjump/db';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import * as s from '~/structs';

import { getServerSession } from './next-auth';

const Session = s.type({
  id: s.string(),
  expires: s.string(),
});

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (props: CreateNextContextOptions) => {
  const { req, res } = props;

  const getSession = async () => {
    const session = await getServerSession(props);
    return Session.is(session) ? session : undefined;
  };

  const getUser = async (include?: Prisma.UserInclude) => {
    const session = await getSession();

    if (!session) {
      return;
    }

    return prisma.user.findUnique({ where: { id: session.id }, include }) ?? undefined;
  };

  return { req, res, prisma, getSession, getUser };
};

export type Context = inferAsyncReturnType<typeof createContext>;
