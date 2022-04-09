import { prisma } from '@kickjump/db';
import { TRPCError } from '@trpc/server';
import { serialize } from 'cookie';
import crypto from 'node:crypto';

import { createRouter } from '~/server/create-router';
import * as s from '~/structs';

import { verifySolanaWallet } from '../verify-solana-wallet';

/**
 * The utility api endpoints that I'm not sure where to place.
 */
export const userWalletRouter = createRouter()
  /** Get all the wallets owned by the user */
  .query('getAll', {
    input: s.type({ id: s.nonempty(s.string()) }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const session = await ctx.getSession();

      if (session?.id !== id) {
        throw new TRPCError({
          message: 'Not authorized to view the requested resource.',
          code: 'UNAUTHORIZED',
        });
      }

      const wallets = await prisma.userWallet.findMany({
        where: { userId: id },
      });

      return wallets;
    },
  })
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
  .mutation('connect', {
    input: s.VerifySolanaWallet,
    async resolve({ ctx, input }) {
      const { getSession, req } = ctx;
      const { publicKey, signature: signature } = input;
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

      verifySolanaWallet({ nonce, publicKey, signature: signature, type: 'connect' });

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
      });
    },
  });
