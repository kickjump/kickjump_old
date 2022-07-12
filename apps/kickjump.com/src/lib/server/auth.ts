import type { UserModel } from '@kickjump/db';
import {
  type GitHubScope,
  Authenticator,
  createAuthEndpoints,
  GitHubStrategy,
  ServerError,
} from '@kickjump/svelte-auth';

import { env } from '$server/env';
import { getAbsoluteUrl } from '$server/get-absolute-url';

const GITHUB_SCOPE: GitHubScope[] = ['read:user', 'user:follow'];
export const authenticator = new Authenticator({ origin: getAbsoluteUrl('/', true) }).use(
  new GitHubStrategy(
    { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, scope: GITHUB_SCOPE },
    async (props) => {
      const { profile, accessToken } = props;
      const providerAccountId = profile.id.toString();
      const provider = 'github';
      const { UserModel } = await import('@kickjump/db');
      let existingUser = await UserModel.getByAccount({ provider, providerAccountId });

      // Since the account already exists return the user
      if (existingUser) {
        return { user: existingUser, provider, error: false };
      }

      // here you would find or create a user in your database
      existingUser = await UserModel.getByEmail(profile._json.email);

      const newAccount: UserModel.AccountCreateInput = {
        refreshToken: null,
        provider,
        providerAccountId,
        accountType: 'oauth',
        accessToken,
        scope: GITHUB_SCOPE,
      };

      const newEmail: UserModel.EmailCreateInput = {
        email: profile._json.email,
        primary: true,
        verified: true,
      };

      // the user doesn't exist; create the user and account;
      if (!existingUser) {
        existingUser = await UserModel.create(
          { name: profile._json.name, image: profile._json.avatar_url },
          { accounts: [newAccount], emails: [newEmail] },
        );
      }

      const account = existingUser.accounts.find((account) => account.provider === provider);

      if (!account) {
        await UserModel.linkAccount(existingUser.id, newAccount);
      } else if (account.providerAccountId !== providerAccountId) {
        throw ServerError.auth(
          'A different GitHub account has already been linked to this account.',
        );
      }

      // the user exists; account doesn't; create the account and attach to user
      return { user: existingUser, provider, error: false };
    },
  ),
);

export const { get, post } = createAuthEndpoints(authenticator);
