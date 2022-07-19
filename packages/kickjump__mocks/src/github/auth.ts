import { randomBytes } from 'node:crypto';
import type { MockAgent } from 'undici';

import { USERS } from './data.js';
const GITHUB = 'https://github.com';

export function githubAuth(agent: MockAgent<MockAgent.Options>) {
  const github = agent.get(GITHUB);

  // oauth2
  github
    .intercept({
      path: '/login/oauth/access_token',
      method: 'POST',
    })
    .reply((props) => {
      const params = new URLSearchParams((props.body ?? '').toString());
      const code = params.get('code') ?? '';
      const [, value] = Object.entries(USERS).find((entry) => entry[1].auth.code === code) ?? [];

      const data = new URLSearchParams();
      data.set('access_token', value?.auth.accessToken ?? randomBytes(10).toString('hex'));
      data.set('refresh_token', value?.auth.refreshToken ?? randomBytes(20).toString('hex'));
      data.set('expires_in', `${100_000}`);
      data.set('refresh_token_expires_in', `${1_000_000}`);
      data.set('token_type', 'abc');

      return {
        statusCode: 200,
        data: data.toString(),
        responseOptions: {
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        },
      };
    });
}
