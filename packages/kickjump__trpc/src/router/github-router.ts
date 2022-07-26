import type _types from '@octokit/types';
import { z } from 'zod';

import { t } from '../init.js';
import { withGitHubAccount } from '../middleware.js';
import { parseLinkHeader } from '../parse-link-header.js';

// const cursor = s.nullable(s.optional(s.number()));
const cursor = z.number().nullable().optional();

export const github = t.router({
  userInstallations: withGitHubAccount.query(async (props) => {
    const { octokit } = props.ctx;
    const { data } = await octokit.rest.apps.listInstallationsForAuthenticatedUser();
    const { total_count: totalCount, installations } = data;

    return { totalCount, installations };
  }),

  userReposForInstallation: withGitHubAccount
    .input(z.object({ id: z.number(), cursor }))
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
      z
        .object({
          cursor,
          perPage: z.number().optional(),
        })
        .strict(),
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
