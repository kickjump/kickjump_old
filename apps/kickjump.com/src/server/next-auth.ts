import { prisma } from '@kickjump/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { TRPCError } from '@trpc/server';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { getServerSession as getSession } from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

import * as s from '~/structs';

import { verifySolanaWallet } from './verify-solana-wallet';

const SolanaCredential = s.type({
  publicKey: s.string(),
  signature: s.string(),
  nonce: s.string(),
});

function SolanaProvider(cookies: Record<string, string | undefined>) {
  return CredentialProvider({
    id: 'solana',
    name: 'Solana',
    type: 'credentials',
    // TODO fix the missing cookies for some reason.
    authorize: async (creds) => {
      const nonce = cookies['auth-nonce'];

      if (!nonce) {
        throw new TRPCError({ message: 'No security nonce found!', code: 'UNAUTHORIZED' });
      }

      const { publicKey, signature } = s.create(creds, SolanaCredential);
      verifySolanaWallet({ nonce, publicKey, signature: signature, type: 'login' });

      /// Only allow the user to
      const wallet = await prisma.userWallet.findUnique({
        where: { publicKey },
        include: { user: true },
      });

      console.log({ wallet });

      return wallet?.user ?? null;
    },
    credentials: {
      publicKey: { label: '', type: 'hidden' },
      signature: { label: '', type: 'hidden' },
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
    // session: { strategy: 'jwt', },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error', // Error code passed in query string as ?error=
      verifyRequest: '/auth/verify-request', // (used for check email message)
      newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
      async jwt({ token, user }) {
        if (!token.id && user?.id) {
          token.id = user.id;
        }

        return token;
      },
      async session({ session, token }) {
        if (!session.id) {
          session.id = s.string().is(token.id) ? token.id : '';
        }

        return session;
      },
    },
  };
}

export function authHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log({ url: req.url, method: req.method, body: req.cookies });
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

declare module 'next-auth' {
  interface DefaultSession {
    id: string;
  }

  interface DefaultJWT {
    id?: string;
  }
}
