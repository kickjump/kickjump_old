import { type LinkAccountToUser, UserModel } from '@kickjump/db';
import type { OAuth2Provider, OAuth2ProviderConfig } from 'sk-auth/dist/providers/oauth2';
import type { GitHubTokens } from 'sk-auth/providers';
import { GitHubOAuth2Provider } from 'sk-auth/providers';

import { AuthorizationError } from './error';

export interface GitHubProfileData {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: {
    name: string;
    space: number;
    private_repos: number;
    collaborators: number;
  };
}

export type GitHubScope =
  | 'repo'
  | 'repo:status'
  | 'repo_deployment'
  | 'public_repo'
  | 'repo:invite'
  | 'security_events'
  | 'admin:repo_hook'
  | 'write:repo_hook'
  | 'read:repo_hook'
  | 'admin:org'
  | 'write:org'
  | 'read:org'
  | 'admin:public_key'
  | 'write:public_key'
  | 'read:public_key'
  | 'admin:org_hook'
  | 'gist'
  | 'notifications'
  | 'user'
  | 'read:user'
  | 'user:email'
  | 'user:follow'
  | 'delete_repo'
  | 'write:discussion'
  | 'read:discussion'
  | 'write:packages'
  | 'read:packages'
  | 'delete:packages'
  | 'admin:gpg_key'
  | 'write:gpg_key'
  | 'read:gpg_key'
  | 'codespace'
  | 'workflow';

type GitHubOAuth2ProviderConfig = Omit<
  OAuth2ProviderConfig<GitHubProfileData, GitHubTokens>,
  'scope'
> & { scope?: GitHubScope[] };
export type __T = OAuth2Provider<GitHubProfileData, GitHubTokens, GitHubOAuth2ProviderConfig>;

type ProviderConstructor = typeof OAuth2Provider;
export const GitHubProvider = GitHubOAuth2Provider as unknown as ProviderConstructor;

export const GITHUB_SCOPE: GitHubScope[] = ['read:user', 'user:follow'];

export async function getGitHubProfile(
  profile: GitHubProfileData,
  tokens: GitHubTokens,
): Promise<App.Session> {
  const { access_token: accessToken, expires_in: expiresIn } = tokens;
  const providerAccountId = profile.id.toString();
  const provider = 'github';
  let existingUser = await UserModel.getByAccount({ provider, providerAccountId });

  // Since the account already exists return the user
  if (existingUser) {
    return { user: existingUser, provider, error: false };
  }

  const date = new Date();
  const expiresAt = date.getTime() + expiresIn * 1000;

  // here you would find or create a user in your database
  existingUser = await UserModel.getByEmail(profile.email);

  const newAccount: Omit<LinkAccountToUser, 'userId'> = {
    provider,
    providerAccountId,
    type: 'oauth',
    accessToken,
    scope: GITHUB_SCOPE.join(','),
    expiresAt,
  };

  // the user doesn't exist; create the user and account;
  if (!existingUser) {
    existingUser = await UserModel.create({
      name: profile.name,
      image: profile.avatar_url,
      primaryEmail: profile.email,
      accounts: { create: newAccount },
      // Automatically verify the account when using social login.
      emails: { create: { email: profile.email, emailVerified: date } },
    });
  }

  const account = existingUser.accounts.find((account) => account.provider === provider);

  if (!account) {
    // account
    await UserModel.linkAccount({ userId: existingUser.id, ...newAccount });
  } else if (account.providerAccountId !== providerAccountId) {
    throw new AuthorizationError(
      'A different GitHub account has already been linked to this account.',
    );
  }

  // the user exists; account doesn't; create the account and attach to user
  return { user: existingUser, provider, error: false };
}
