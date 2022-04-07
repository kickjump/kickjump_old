import { prisma } from '@kickjump/db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { getServerSession as getSession } from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

import * as s from '~/structs';

import { env } from './env';
import { verifySolanaWallet } from './verify-solana-wallet';

const SolanaCredential = s.type({
  publicKey: s.string(),
  signature: s.string(),
  nonce: s.string(),
});

function SolanaProvider(_: Record<string, string | undefined>) {
  return CredentialProvider({
    id: 'solana',
    name: 'Solana',
    type: 'credentials',
    // TODO fix the missing cookies for some reason.
    authorize: async (creds) => {
      const { publicKey, signature, nonce } = s.create(creds, SolanaCredential);

      // Ensure the public key and signature are valid.
      verifySolanaWallet({ nonce, publicKey, signature: signature, type: 'login' });

      // Only allow login when the wallet provided is already connected to a
      // user account.
      const wallet = await prisma.userWallet.findUnique({
        where: { publicKey },
        include: { user: true },
      });

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
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        // Available Scopes
        // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
        authorization: { params: { scope: 'read:user public_repo read:org' } },
      }),
      SolanaProvider(cookies),
    ],
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    jwt: { secret: env.JWT_SECRET },
    cookies: {},
    secret: env.NEXTAUTH_SECRET,
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
