import { prisma } from '@kickjump/db';
import { TRPCError } from '@trpc/server';
import { serialize } from 'cookie';
import crypto from 'node:crypto';

import { createRouter } from '~/server/create-router';

import { VerifySolanaPublicKey, verifySolanaPublicKey } from '../utils';

/**
 * The utility api endpoints that I'm not sure where to place.
 */
export const adhocRouter = createRouter()
  .mutation('nonce', {
    input: () => {},
    async resolve({ ctx }) {
      const nonce = crypto.randomBytes(32).toString('base64');
      ctx.res.setHeader(
        'Set-Cookie',
        serialize('auth-nonce', nonce, { httpOnly: true, sameSite: 'strict', secure: true }),
      );

      return { nonce };
    },
  })
  .mutation('connectWallet', {
    input: VerifySolanaPublicKey,
    async resolve({ ctx, input }) {
      const { getSession, req } = ctx;
      const { publicKey, signature } = input;
      const session = await getSession();

      if (!session) {
        throw new TRPCError({
          message: 'Must be logged in to connect wallet',
          code: 'UNAUTHORIZED',
        });
      }

      const nonce = req.cookies['auth-nonce'];

      if (!nonce) {
        throw new TRPCError({
          message: 'Must provide a nonce to verify the public key.',
          code: 'PRECONDITION_FAILED',
        });
      }

      verifySolanaPublicKey({ nonce, publicKey, signature, type: 'connect' });

      const { id } = session;
      const [user, wallet] = await Promise.all([
        prisma.user.findUnique({ where: { id } }),
        prisma.userWallet.findUnique({
          where: { publicKey },
          include: { user: true },
        }),
      ]);

      if (!user) {
        throw new TRPCError({ message: 'No user found', code: 'UNAUTHORIZED' });
      }

      if (wallet && wallet.user.id === user.id) {
        throw new TRPCError({
          message: 'Wallet already exists and is attached to the current user',
          code: 'FORBIDDEN',
        });
      }

      if (wallet && wallet.user.id === user.id) {
        throw new TRPCError({
          message: 'Wallet already exists.',
          code: 'FORBIDDEN',
        });
      }

      return prisma.userWallet.create({
        data: { publicKey, user: { connect: { id } } },
        include: { user: true },
      });
    },
  });
