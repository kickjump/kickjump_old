import { teardown } from 'jest-process-manager';

import { TEST_EDGEDB_INSTANCE } from './utils.js';

export default async function globalTeardown() {
  process.env.EDGEDB_INSTANCE = TEST_EDGEDB_INSTANCE;
  await teardown();

  const { e, run } = await import('@kickjump/db');

  // Delete everything!
  await run(e.delete(e.Object), { unsafeIgnorePolicies: true });
}
