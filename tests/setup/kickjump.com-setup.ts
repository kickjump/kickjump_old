import { setup } from 'jest-process-manager';

import { instanceExists, setupDatabase, TEST_EDGEDB_INSTANCE } from './utils.js';

export default async function globalSetup() {
  process.env.EDGEDB_INSTANCE = TEST_EDGEDB_INSTANCE;

  if (!(await instanceExists(TEST_EDGEDB_INSTANCE))) {
    await setupDatabase(TEST_EDGEDB_INSTANCE);
  }

  await setup({
    command: `WEBSITE_URL="http://localhost:3030" EDGEDB_INSTANCE="${TEST_EDGEDB_INSTANCE}" VITE_ENDPOINT_MOCKING_ENABLED="true" pnpm -w dev:kickjump.com --mode "e2e" --port 3030`,
    port: 3030,
    usedPortAction: 'ignore',
    launchTimeout: 30_000,
    debug: true,
  });
}
