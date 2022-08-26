import {
  instanceExists,
  migrateDatabase,
  setupDatabase,
  SPEC_EDGEDB_INSTANCE,
} from '../src/utils.js';

export default async function globalSetup() {
  process.env.EDGEDB_INSTANCE = SPEC_EDGEDB_INSTANCE;

  if (!(await instanceExists(SPEC_EDGEDB_INSTANCE))) {
    try {
      await setupDatabase(SPEC_EDGEDB_INSTANCE);
    } catch {
      console.log('something went wrong when creating the database');
      await migrateDatabase(SPEC_EDGEDB_INSTANCE);
    }
  } else {
    await migrateDatabase(SPEC_EDGEDB_INSTANCE);
  }

  const { e, run } = await import('@kickjump/db');
  await run(e.delete(e.Object), { unsafeIgnorePolicies: true });

  return async () => {
    // Delete everything!
    await run(e.delete(e.Object), { unsafeIgnorePolicies: true });
  };
}
