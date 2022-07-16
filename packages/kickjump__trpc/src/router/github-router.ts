import type * as _ from '@octokit/types';

import { s } from '../client/index.js';
import { t } from '../init.js';
import { withGitHubAccount } from '../middleware.js';
import { parseLinkHeader } from '../parse-link-header.js';

export const github = t.router({
  userInstallations: withGitHubAccount.query(async (props) => {
    const { octokit } = props.ctx;
    const { data } = await octokit.rest.apps.listInstallationsForAuthenticatedUser();
    const { total_count: totalCount, installations } = data;

    return { totalCount, installations };
  }),

  repos: withGitHubAccount
    .input(
      s.object({
        cursor: s.nullable(s.optional(s.number())),
        perPage: s.number(),
      }),
    )
    .query(async (props) => {
      const { ctx, input } = props;
      const { octokit } = ctx;
      console.log('about to get a response');
      const response = await octokit.rest.repos.listForAuthenticatedUser({
        page: input.cursor as number,
      });
      console.log(response);
      const { data: items, headers } = response;
      const parsedLinks = parseLinkHeader(headers.link);
      console.log(items.length, items);

      return { items: [], nextCursor: parsedLinks.next?.page, prevCursor: parsedLinks.prev?.page };
    }),
});
