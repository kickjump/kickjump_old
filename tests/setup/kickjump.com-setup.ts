import { request } from '@kickjump/playwright';
import { setup, teardown } from 'jest-process-manager';
import { loadJsonFile } from 'load-json-file';

import { instanceExists, setupDatabase, STORAGE_STATE, TEST_EDGEDB_INSTANCE } from './utils.js';

export default async function globalSetup() {
  process.env.EDGEDB_INSTANCE = TEST_EDGEDB_INSTANCE;

  if (!(await instanceExists(TEST_EDGEDB_INSTANCE))) {
    await setupDatabase(TEST_EDGEDB_INSTANCE);
  }

  await setup({
    command: `WEBSITE_URL="http://localhost:3030" EDGEDB_INSTANCE="${TEST_EDGEDB_INSTANCE}" VITE_ENDPOINT_MOCKING_ENABLED="true" pnpm -w dev:kickjump.com --mode "e2e" --port 3030 &> /dev/null`,
    port: 3030,
    usedPortAction: 'kill',
    launchTimeout: 30_000,
    debug: false,
  });

  try {
    const storageState = await gracefulReadStorageState(STORAGE_STATE);

    for (const cookie of storageState?.cookies ?? []) {
      if (cookie.name === 'kit.session' && cookie.expires * 1000 + 600_000 > Date.now()) {
        return;
      }
    }

    // signin via api request.
    const context = await request.newContext({ baseURL: 'localhost:3030' });
    // Use GET to skip the csrf token verification.
    await context.get('http://localhost:3030/auth/login/mock', {
      params: { username: 'octocat' },
    });

    // save signed in state
    await context.storageState({ path: STORAGE_STATE });
    context.storageState({});
    await context.dispose();
  } catch (error) {
    await teardown();
    throw error;
  }
}

async function gracefulReadStorageState(name: string) {
  try {
    const filepath = new URL(`../${name}`, import.meta.url).pathname;
    const json = await loadJsonFile<StorageState>(filepath);
    return json;
  } catch {
    return;
  }
}

interface StorageState {
  cookies: Cooky[];
  origins: any[];
}

interface Cooky {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}
