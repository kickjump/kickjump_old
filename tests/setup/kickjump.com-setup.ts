import { instanceExists, setupDatabase, TEST_EDGEDB_INSTANCE } from './db-setup.js';

export default async function globalSetup() {
  process.env.EDGEDB_INSTANCE = TEST_EDGEDB_INSTANCE;

  if (await instanceExists(TEST_EDGEDB_INSTANCE)) {
    return;
  }

  await setupDatabase(TEST_EDGEDB_INSTANCE);
}
