import { prisma } from '@kickjump/db';
import { App } from '@octokit/app';
import { createAppAuth, createOAuthUserAuth } from '@octokit/auth-app';
import { TRPCError } from '@trpc/server';
import { Octokit } from 'octokit';

import { createRouter } from '~/server/create-router';
import * as s from '~/structs';

import { env } from '../env';

/**
 * The utility api endpoints that I'm not sure where to place.
 */
export const githubRouter = createRouter().query('repos', {
  async resolve({ ctx }) {
    const session = await ctx.getSession();

    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Must be logged in to view repositories',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { accounts: { where: { provider: 'github' } } },
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Must be logged in to view repositories',
      });
    }

    const { access_token: token } = user.accounts[0] ?? {};

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'GitHub token has expired',
      });
    }

    console.log({ token });

    // const auth = createOAuthUserAuth({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    //   token,
    // });

    // const something = await auth({ type: 'get',  });

    const octokit = new Octokit({
      authStrategy: createOAuthUserAuth,
      auth: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, token },
    });

    await octokit.auth();
    return octokit.rest.repos.listForAuthenticatedUser({});

    // const [
    //   {
    //     data: { login },
    //   },
    //   repos,
    // ] = await Promise.all([
    //   octokit.rest.users.getAuthenticated(),
    //   // octokit.rest.orgs.listMembershipsForAuthenticatedUser(),

    //   // octokit.rest.orgs.listForAuthenticatedUser(),
    // ]);

    // const app = new App({
    //   oauth: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, token },
    //   appId: env.GITHUB_APP_ID,
    //   privateKey: decodeBase64(env.GITHUB_APP_PRIVATE_KEY),
    // });
    // const installations = await app.eachRepository;
    // app.
  },
});
