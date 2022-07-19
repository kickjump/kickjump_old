import type { MockAgent } from 'undici';
import type { MockInterceptor } from 'undici/types/mock-interceptor.js';

import type { GitHubUserData } from './data.js';
import { USERS } from './data.js';

const API = 'https://api.github.com';

export function githubApi(agent: MockAgent<MockAgent.Options>) {
  const client = agent.get(API);

  client.intercept({ path: '/user', method: 'GET' }).reply((props) => {
    const accessToken = getAccessToken(props);

    if (!accessToken) {
      return ERROR;
    }

    const data = getData<null>(accessToken, null)?.user;

    if (!data) {
      return ERROR;
    }

    return { statusCode: 200, data };
  });

  client.intercept({ path: '/user/emails', method: 'GET' }).reply((props) => {
    const accessToken = getAccessToken(props);

    if (!accessToken) {
      return ERROR;
    }

    const email = getData<null>(accessToken, null)?.user.email;

    if (!email) {
      return ERROR;
    }

    const data = [{ email, verified: true, primary: true, visibility: 'private' }];

    return { statusCode: 200, data };
  });
}

function getAccessToken(props: MockInterceptor.MockResponseCallbackOptions): string | undefined {
  const headers = props.headers as unknown as string[];
  const accept = headers[1];
  const authorization = headers[3];

  const [, accessToken] = authorization?.split(' ') ?? [];

  if (!accept || !accessToken) {
    return;
  }

  return accessToken;
}

function getData<Type>(accessToken: string, fallback: Type): GitHubUserData | Type {
  const value = Object.entries(USERS).find(([, fields]) => {
    return fields.auth.accessToken === accessToken;
  });

  return value?.[1] ?? fallback;
}

const ERROR = {
  statusCode: 403,
  data: { error: 'Invalid request' } as any,
};
