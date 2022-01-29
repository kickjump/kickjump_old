import { prisma } from '@kickjump/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import { getServerSession as getSession } from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import * as s from 'superstruct';

import { verifySolanaPublicKey } from './utils';

const SolanaCredential = s.type({
  publicKey: s.string(),
  signature: s.string(),
  nonce: s.string(),
});

function SolanaProvider(cookies: Record<string, string | undefined>) {
  return CredentialProvider({
    type: 'credentials',
    id: 'solana-wallet',
    name: 'Solana Wallet',
    authorize: async (creds) => {
      const nonce = cookies['auth-nonce'];

      if (!nonce) {
        return null;
      }

      const { publicKey, signature } = s.create(creds, SolanaCredential);
      verifySolanaPublicKey({ nonce, publicKey, signature, type: 'login' });

      /// Only allow the user to
      const wallet = await prisma.userWallet.findUnique({
        where: { publicKey },
        include: { user: true },
      });

      return wallet?.user ?? null;
    },
    credentials: {
      publicKey: {},
      signature: {},
    },
  });
}

export function createAuthOptions(cookies: Record<string, string | undefined>): NextAuthOptions {
  return {
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      SolanaProvider(cookies),
    ],
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }

        return token;
      },
      async session({ session, user }) {
        session.id = user.id;
        return session;
      },
    },
  };
}

export function authHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, createAuthOptions(req.cookies));
}

type GetAuthSessionProps =
  | GetServerSidePropsContext
  | {
      req: NextApiRequest;
      res: NextApiResponse;
    };

/**
 * Get the authentication session on the server only.
 */
export function getServerSession(props: GetAuthSessionProps) {
  const { req } = props;
  return getSession(props, createAuthOptions(req.cookies));
}
