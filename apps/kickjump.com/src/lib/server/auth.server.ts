import { redirect } from '@remix-run/node';
import { PublicKey } from '@solana/web3.js';
import base58 from 'bs58';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import type { GitHubScope } from 'remix-auth-socials';
import { GitHubStrategy, SocialsProvider } from 'remix-auth-socials';
import nacl from 'tweetnacl';

import { UserModel } from '~/utils/db.server';
import { env } from '~/utils/env.server';
import { sessionStorage } from '~/utils/session.server';
import { getWalletMessage } from '~/utils/solana';

import { addNextUrlToQuery, getAbsoluteUrl, stringToUint8Array } from '../utils/core';
import type { SolanaLoginSchema } from './validators';
import { solanaLoginValidator } from './validators';

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
  new FormStrategy(async ({ form, context }) => {
    // validate the data
    const result = await solanaLoginValidator.validate(form);

    if (result.error) {
      throw result.error;
    }

    // The hash is passed through in the context.
    if (!context.hash) {
      throw new AuthorizationError('No hash detected in the session.');
    }

    // Ensure that the provided data is a valid wallet signature.
    verifySolanaWallet({ hash: context.hash, type: 'login', ...result.data });

    // Find the user, if existing.
    const user = await UserModel.getByWallet(result.data.publicKey);

    if (!user) {
      throw new AuthorizationError('The provided wallet has not been connected to a user.');
    }

    return { id: user.id };
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

interface VerifySolanaWallet extends SolanaLoginSchema {
  /**
   * `connect` - should be used when user is already logged in and would like to
   * add a wallet to their account.
   *
   * `login` - once a wallet has been connected it can be used to login to the
   * user account.
   */
  type: 'connect' | 'login';

  /**
   * The hash is stored in a secure cookie and used to mangle the signature so
   * that if the request is intercepted it can't be used to validate the wallet
   * falsely.
   */
  hash: string;
}

/**
 * Will throw an error if the public key is not valid.
 */
export function verifySolanaWallet(props: VerifySolanaWallet) {
  const { type, publicKey, signature, hash } = props;
  const messageBytes = stringToUint8Array(getWalletMessage({ hash, type }));
  const publicKeyBytes = new PublicKey(publicKey).toBuffer();
  const signatureBytes = base58.decode(signature);
  const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

  if (!verified) {
    console.error(`solana public key validation failed`);
    throw new AuthorizationError(
      'The provided solana wallet could not be verified with the given signature.',
    );
  }
}
