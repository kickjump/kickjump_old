// import { e, UserModel } from '@kickjump/db';
// import { App } from '@octokit/app';
// import { createAppAuth, createOAuthUserAuth } from '@octokit/auth-app';
import type * as _ from '@octokit/types';
// import { TRPCError } from '@trpc/server';
// import { randomBytes } from 'node:crypto';
import { Octokit } from 'octokit';

import { t, withGitHubAccount } from '../init.js';

export const github = t.router({
  // play: authenticated.query(async ({ ctx }) => {
  //   console.log('inside github router!!');
  //   const accounts = await UserModel.getAccountsByUserId(ctx.user.id, 'github');
  //   const account = accounts.at(0);

  //   if (!account?.accessToken) {
  //     throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing github account accessToken' });
  //   }

  //   const { accessToken } = account;
  //   console.log('access token here', accessToken);
  //   const octokit = new Octokit({
  //     auth: accessToken,
  //   });

  //   console.log('created octokit');
  //   // octokit.rest.apps.updateWebhookConfigForApp;
  //   const repos = await octokit.rest.repos.listForAuthenticatedUser({});
  //   // await octokit.auth();
  //   // const values = await octokit.rest.repos.listForAuthenticatedUser();
  //   console.log(repos);

  //   return repos;
  // }),
  installableRepos: withGitHubAccount.query(async ({ ctx }) => {
    const octokit = new Octokit({ auth: ctx.account.accessToken });
    const repos = await octokit.rest.repos.listForAuthenticatedUser({});

    return repos;
  }),
});

export const INSTALLATION_STATE_KEY = '_gh:installation:state';

declare global {
  namespace App {
    interface Session {
      [INSTALLATION_STATE_KEY]?: { id: string; redirect: string };
    }
  }
}
