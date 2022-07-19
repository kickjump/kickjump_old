import { randomBytes } from 'node:crypto';

import { agent } from '../agent.js';

export function githubApi() {
  const API = 'https://api.github.com';
  const api = agent.get(API);

  api.intercept({
    path: '/example',
  });
}

export function githubWebsite() {
  const GITHUB = 'https://github.com';
  const github = agent.get(GITHUB);

  // oauth2
  github
    .intercept({
      path: '/login/oauth/access_token',
      method: 'POST',
    })
    .reply((_) => {
      const data = new URLSearchParams();
      data.set('access_token', randomBytes(10).toString('hex'));
      data.set('refresh_token', randomBytes(20).toString('hex'));
      data.set('expires_in', `${100_000}`);
      data.set('refresh_token_expires_in', `${1_000_000}`);
      data.set('token_type', 'abc');

      return { statusCode: 200, data, responseOptions: {} };
    });
}
