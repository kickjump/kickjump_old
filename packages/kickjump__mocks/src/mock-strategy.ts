import { AccountProvider, UserModel } from '@kickjump/db';
import type { AuthenticateReturn, StrategyAuthenticateProps } from '@kickjump/svelte-auth';
import { ServerError, Strategy } from '@kickjump/svelte-auth';

import {
  type GitHubUserData,
  type GitHubUsername,
  GITHUB_USERNAMES,
  USERS,
} from './github/data.js';

interface MockParams {
  username: GitHubUsername;
  data: GitHubUserData;
}
export class MockStrategy extends Strategy<MockParams> {
  readonly name = 'mock';

  async authenticate(event: StrategyAuthenticateProps): Promise<AuthenticateReturn> {
    if (process.env.VITE_ENDPOINT_MOCKING_ENABLED !== 'true') {
      throw ServerError.auth('Mock auth must not be used outside of a mock environment.');
    }

    const { action, request } = event;
    const url = new URL(request.url);
    const username = url.searchParams.get('username') as GitHubUsername;

    if (action !== 'login') {
      throw ServerError.auth('Invalid mock action');
    }

    if (!GITHUB_USERNAMES.includes(username)) {
      throw ServerError.auth('Invalid username provided');
    }

    const [, data] = Object.entries(USERS).find(([name]) => name === username) ?? [];

    if (!data) {
      throw ServerError.auth('No data found for the user provided');
    }

    const user = await this.verify({ username, data });

    return { user };
  }
}

export const mockStrategy = new MockStrategy(async (props) => {
  const { username, data } = props;
  const { accessToken, refreshToken, providerAccountId } = data.auth;

  let user = await UserModel.findByAccount({ provider: 'github', providerAccountId });

  if (!user) {
    user = await UserModel.create({
      accounts: [
        {
          accountType: 'oauth2',
          provider: AccountProvider.github,
          providerAccountId,
          accessToken,
          refreshToken,
          login: username,
          scope: ['user:email'],
        },
      ],
      username,
      emails: [{ email: data.user.email as string, primary: true, verified: true }],
      image: data.user.avatar_url,
      name: data.user.name,
    });
  }

  return { id: user.id, image: user.image, name: user.name, email: user?.emails.at(0)?.email };
});
