import { s } from '@kickjump/validation';
import type * as _ from '@octokit/types';

import { t } from '../init.js';
import { withGitHubAccount } from '../middleware.js';
import { parseLinkHeader } from '../parse-link-header.js';

const cursor = s.nullable(s.optional(s.number()));

export const github = t.router({
  userInstallations: withGitHubAccount.query(async (props) => {
    const { octokit } = props.ctx;
    const { data } = await octokit.rest.apps.listInstallationsForAuthenticatedUser();
    const { total_count: totalCount, installations } = data;

    return { totalCount, installations };
  }),

  userReposForInstallation: withGitHubAccount
    .input(s.object({ id: s.number(), cursor }))
    .query(async (props) => {
      const {
        ctx: { octokit },
        input: { id, cursor },
      } = props;
      const response = await octokit.rest.apps.listInstallationReposForAuthenticatedUser({
        installation_id: id,
        page: cursor as number,
      });
      const { data, headers } = response;
      const parsedLinks = parseLinkHeader(headers.link);
      const { repositories, total_count: count, repository_selection: selection } = data;

      const a = await octokit.rest.users.getAuthenticated();
      a.data.avatar_url;
      return {
        repositories,
        count,
        selection,
        nextCursor: parsedLinks.next?.page,
        prevCursor: parsedLinks.prev?.page,
      };
    }),

  userRepos: withGitHubAccount
    .input(
      s.object({
        cursor,
        perPage: s.optional(s.number()),
      }),
    )
    .query(async (props) => {
      const {
        ctx: { octokit },
        input: { perPage: per_page = 50, cursor },
      } = props;
      const page = cursor as number;
      const response = await octokit.rest.repos.listForAuthenticatedUser({ page, per_page });
      const { data: items, headers } = response;
      const parsedLinks = parseLinkHeader(headers.link);

      return { items, nextCursor: parsedLinks.next?.page, prevCursor: parsedLinks.prev?.page };
    }),
});
