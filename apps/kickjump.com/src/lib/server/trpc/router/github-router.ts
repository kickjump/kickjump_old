import '@octokit/types';

import { e, UserModel } from '@kickjump/db';
import { App } from '@octokit/app';
import { createAppAuth, createOAuthUserAuth } from '@octokit/auth-app';
import { TRPCError } from '@trpc/server';
import { Octokit } from 'octokit';

import { env } from '$server/env';

import { authenticated, t } from '../init.js';

export const github = t.router({
  play: authenticated.query(async ({ ctx }) => {
    console.log('inside github router!!');
    const email = ctx.user.email;
    const accounts = await UserModel.getAccountsByUserId(ctx.user.id, 'github');
    const account = accounts.at(0);

    if (!account?.accessToken) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing github account accessToken' });
    }

    const { accessToken } = account;
    console.log('access token here', accessToken);
    const octokit = new Octokit({
      auth: accessToken,
    });

    console.log('created octokit');
    // octokit.rest.apps.updateWebhookConfigForApp;
    const repos = await octokit.rest.repos.listForAuthenticatedUser({});
    // await octokit.auth();
    // const values = await octokit.rest.repos.listForAuthenticatedUser();
    console.log(repos);

    return repos;
  }),
});
