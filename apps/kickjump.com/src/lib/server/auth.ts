import type { UserModel } from '@kickjump/db';
import {
  type GitHubScope,
  Authenticator,
  GitHubStrategy,
  ServerError,
} from '@kickjump/svelte-auth';

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
      let existingUser: UserModel.PopulatedUser | undefined = await UserModel.findByAccount({
        provider,
        providerAccountId,
      });

      // Since the account already exists return the user
      if (existingUser) {
        return getAppUser(existingUser);
      }

      const emails: UserModel.EmailCreateInput[] = profile.emails
        .filter((email) => email.email && !email.email.endsWith('users.noreply.github.com'))
        .map(({ email }, index) => ({ email, primary: index === 0, verified: true }))
        .slice(0, 1);

      for (const email of emails) {
        // here you would find or create a user in your database
        existingUser = await UserModel.findByEmail(email.email);

        if (existingUser) {
          break;
        }
      }

      const accounts: UserModel.AccountCreateInput[] = [
        {
          refreshToken: null,
          provider,
          providerAccountId,
          accountType: 'oauth',
          accessToken,
          scope: GITHUB_SCOPE,
          login: profile._json.login,
        },
      ];

      // the user doesn't exist; create the user and account;
      if (!existingUser) {
        existingUser = await UserModel.create({
          name: profile._json.name,
          image: profile._json.avatar_url,
          accounts,
          emails,
        });
      }

      const account = existingUser.accounts.find((account) => account.provider === provider);

      if (!account) {
        await UserModel.linkAccounts(existingUser.id, accounts);
      } else if (account.providerAccountId !== providerAccountId) {
        throw ServerError.auth('A different GitHub account has already been linked to this user.');
      }

      // the user exists; account doesn't; create the account and attach to user
      return getAppUser(existingUser);
    },
  ),
);

function getAppUser(user: UserModel.PopulatedUser): App.User {
  const { id, image, name, emails } = user;
  const email = emails.at(0)?.email;

  return { id, image, name, email };
}
