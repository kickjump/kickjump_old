import type * as _ from '@octokit/types';
import { Octokit } from 'octokit';

import { s } from '../client/index.js';
import { t } from '../init.js';
import { withGitHubAccount } from '../middleware.js';
import { parseLinkHeader } from '../parse-link-header.js';

export const github = t.router({
  repos: withGitHubAccount
    .input(
      s.object({
        perPage: s.optional(s.number()),
        cursor: s.optional(s.number()),
      }),
    )
    .query(async (props) => {
      const { ctx, input } = props;
      const { perPage = 100, cursor } = input;
      const octokit = new Octokit({ auth: ctx.account.accessToken });
      // const {
      //   GITHUB_APP_ID: appId,
      //   GITHUB_APP_PRIVATE_KEY: privateKey,
      //   GITHUB_CLIENT_ID: clientId,
      //   GITHUB_CLIENT_SECRET: clientSecret,
      // } = env;
      // const app = new App({ appId, privateKey, oauth: { clientId, clientSecret } });
      // (await app.getInstallationOctokit(1)).rest.users.

      // const { data: repos, headers } = await octokit.rest.repos.listForAuthenticatedUser({
      //   per_page: perPage,
      //   page: cursor,
      //   visibility: 'public',
      // });

      const {
        data: { total_count: count, installations },
        headers,
      } = await octokit.rest.apps.listInstallationsForAuthenticatedUser({
        per_page: perPage,
        page: cursor as number,
      });
      const parsed = parseLinkHeader(headers.link);

      return { count, installations, ...parsed };
    }),
});
