import { request } from '@playwright/test';
import { setup, teardown } from 'jest-process-manager';

import {
  instanceExists,
  migrateDatabase,
  setupDatabase,
  STORAGE_STATE,
  TEST_EDGEDB_INSTANCE,
} from '../src/utils.js';

export default async function globalSetup() {
  process.env.EDGEDB_INSTANCE = TEST_EDGEDB_INSTANCE;

  if (!(await instanceExists(TEST_EDGEDB_INSTANCE))) {
    try {
      await setupDatabase(TEST_EDGEDB_INSTANCE);
    } catch {
      console.log('something went wrong when creating the database');
      await migrateDatabase(TEST_EDGEDB_INSTANCE);
    }
  } else {
    await migrateDatabase(TEST_EDGEDB_INSTANCE);
  }

  await setup({
    command: `VITE_ENDPOINT_MOCKING_ENABLED=true pnpm -w dev:test-server &> /dev/null`,
    port: 3030,
    usedPortAction: 'ignore',
    launchTimeout: 30_000,
    debug: false,
  });

  const { e, run } = await import('@kickjump/db');

  // Delete everything!
  await run(e.delete(e.Object), { unsafeIgnorePolicies: true });

  try {
    // const storageState = await gracefulReadStorageState(STORAGE_STATE);

    // for (const cookie of storageState?.cookies ?? []) {
    //   if (cookie.name === 'kit.session' && cookie.expires * 1000 + 600_000 > Date.now()) {
    //     return;
    //   }
    // }

    // signin via api request.
    const context = await request.newContext({ baseURL: 'localhost:3030' });
    // kick off building the javascript.
    await context.get('http://localhost:3030');
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

// async function gracefulReadStorageState(name: string) {
//   try {
//     const filepath = new URL(`../${name}`, import.meta.url).pathname;
//     const json = await loadJsonFile<StorageState>(filepath);
//     return json;
//   } catch {
//     return;
//   }
// }

// interface StorageState {
//   cookies: Cooky[];
//   origins: any[];
// }

// interface Cooky {
//   name: string;
//   value: string;
//   domain: string;
//   path: string;
//   expires: number;
//   httpOnly: boolean;
//   secure: boolean;
//   sameSite: string;
// }
