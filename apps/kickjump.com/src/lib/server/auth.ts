import type { UserModel } from '@kickjump/db';
import { type GitHubScope, Authenticator, GitHubStrategy } from '@kickjump/svelte-auth';

import { BASE_AUTH } from '$lib/constants.js';
import { env } from '$server/env';
import { getAbsoluteUrl } from '$server/get-absolute-url';

const GITHUB_SCOPE: GitHubScope[] = ['read:user', 'user:follow', 'user:email'];
export const authenticator = new Authenticator({
  origin: getAbsoluteUrl({ forceProtocol: true }),
  basePath: BASE_AUTH,
}).use(
  new GitHubStrategy(
    {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      scope: GITHUB_SCOPE,
      appName: env.GITHUB_APP_NAME,
    },
    async (props) => {
      const { profile, accessToken } = props;

      const providerAccountId = profile.id.toString();
      const provider = 'github';
      const { UserModel } = await import('@kickjump/db');
      const user = await UserModel.findByAccount({ provider, providerAccountId });
      let id = user?.id;

      // Since the account already exists return the user
      if (id) {
        return { id };
      }

      const emails: UserModel.EmailCreateInput[] = profile.emails
        .filter((email) => email.email && !email.email.endsWith('users.noreply.github.com'))
        .map(({ email }, index) => ({ email, primary: index === 0, verified: true }))
        .slice(0, 1);

      for (const email of emails) {
        const user = await UserModel.findByEmail(email.email);
        id = user?.id;

        if (id) {
          break;
        }
      }

      const acc: UserModel.AccountCreateInput = {
        refreshToken: null,
        provider,
        providerAccountId,
        accessToken,
        scope: GITHUB_SCOPE,
        login: profile._json.login,
      };
      const accounts: UserModel.AccountCreateInput[] = [acc];

      // the user doesn't exist; create the user and account;
      if (!id) {
        id = await UserModel.create({
          name: profile._json.name,
          image: profile._json.avatar_url,
          accounts,
          emails,
          username: profile._json.login,
        });
      }

      const account = await UserModel.findProviderAccountById({ id, provider: 'github' });

      if (!account) {
        await UserModel.linkAccounts(id, accounts);
      } else if (account.providerAccountId !== providerAccountId) {
        // TODO(@ifiokjr) check that this doesn't happen
        await UserModel.replaceAccount(id, account.id, acc);
        // throw ServerError.auth('A different GitHub account has already been linked to this user.');
      }

      // the user exists; account doesn't; create the account and attach to user
      return { id };
    },
  ),
);

if (env.VITE_ENDPOINT_MOCKING_ENABLED === 'true') {
  const { mockStrategy } = await import('@kickjump/mocks');
  authenticator.use(mockStrategy);
}
