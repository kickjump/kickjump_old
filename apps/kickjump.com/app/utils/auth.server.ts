import { redirect } from '@remix-run/node';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import type { GitHubScope } from 'remix-auth-socials';
import { GitHubStrategy, SocialsProvider } from 'remix-auth-socials';

import { env } from '~/utils/env.server';
import { sessionStorage } from '~/utils/session.server';

import { addNextUrlToQuery, getAbsoluteUrl } from './core';
import { UserModel } from './db.server';

/**
 * The user data that is stored in the session.
 */
export interface SessionUser {
  /**
   * The user id.
   */
  id: string;
}

// export type AuthenticatorItem =

// Create an instance of the authenticator
export const authenticator = new Authenticator<SessionUser>(sessionStorage, {
  sessionKey: '_session',
});
// You may specify a <User> type which the strategies will return (this will be stored in the session)
// export let authenticator = new Authenticator<User>(sessionStorage, { sessionKey: '_session' });

const GITHUB_SCOPE: GitHubScope[] = ['read:user', 'user:follow'];

authenticator.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: getAbsoluteUrl(`/auth/${SocialsProvider.GITHUB}/callback`),
      scope: GITHUB_SCOPE,
    },
    async ({ profile, accessToken, refreshToken }) => {
      const existingAccount = await UserModel.getByAccount({
        provider: profile.provider,
        providerAccountId: profile.id,
      });

      if (existingAccount) {
        return { id: existingAccount.id };
      }

      const profileEmail = profile.emails[0].value;
      // here you would find or create a user in your database
      let existingUser = await UserModel.getByEmail(profileEmail);

      const newAccount = {
        provider: profile.provider,
        providerAccountId: profile.id,
        type: 'oauth',
        accessToken,
        refreshToken,
        scope: GITHUB_SCOPE.join(','),
      };

      // the user doesn't exist; create the user and account;
      if (!existingUser) {
        existingUser = await UserModel.create({
          name: profile.displayName,
          image: profile.photos[0].value,
          primaryEmail: profileEmail,
          accounts: { create: newAccount },
          // Automatically verify the account when using social login.
          emails: { create: { email: profileEmail, emailVerified: new Date() } },
        });
      }

      const account = existingUser.accounts.find(
        (account) => account.provider === profile.provider,
      );

      if (!account) {
        // account
        await UserModel.linkAccount({ userId: existingUser.id, ...newAccount });
      } else if (account.providerAccountId !== profile.id) {
        throw new AuthorizationError(
          'A different GitHub account has already been linked to this account.',
        );
      }

      // the user exists; account doesn't; create the account and attach to user
      return { id: existingUser.id };
    },
  ),
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    return { id: '' };
  }),
  'solana',
);
// sessionStorage.commitSession

export async function getUserId(request: Request): Promise<string | undefined> {
  const user = await authenticator.isAuthenticated(request);
  return user?.id;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (userId === undefined) {
    return;
  }

  const user = await UserModel.get(userId);

  if (user) {
    return user;
  }

  throw await logout(request);
}

/**
 * Force login for the current route.
 */
export async function requireUserId(
  request: Request,
  next: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect(addNextUrlToQuery('/login', next));
  }

  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const user = await UserModel.get(userId);

  if (user) {
    return user;
  }

  throw await logout(request);
}

export function logout(request: Request): Promise<void> {
  return authenticator.logout(request, { redirectTo: '/' });
}
