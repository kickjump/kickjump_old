import type { MockAgent } from 'undici';

import { githubApi } from './github/api.js';
import { githubAuth } from './github/auth.js';
import { test } from './test.js';

export function setupDomains(agent: MockAgent<MockAgent.Options>) {
  githubApi(agent);
  githubAuth(agent);
  test(agent);
}
