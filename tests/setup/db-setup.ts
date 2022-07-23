import { instanceExists, migrateDatabase, setupDatabase, TEST_EDGEDB_INSTANCE } from './utils.js';
// import { randomBytes } from 'node:crypto';
// import retry from 'p-retry';

// export default async function globalSetup() {
//   const databaseNames: string[] = [];
//   process.env.EDGEDB_INSTANCE = await retry(
//     async () => {
//       const name = `kickjump__testdb_${randomBytes(7).toString('hex')}`;
//       databaseNames.push(name);
//       await setupDatabase(name);

//       return name;
//     },
//     { retries: 3 },
//   );

//   return async () => {
//     for (const name of databaseNames) {
//       try {
//         await teardownDatabase(name);
//       } catch {
//         // ignore errors
//       }
//     }
//   };
// }

export default async function globalSetup() {
  process.env.EDGEDB_INSTANCE = TEST_EDGEDB_INSTANCE;

  if (!(await instanceExists(TEST_EDGEDB_INSTANCE))) {
    try {
      await setupDatabase(TEST_EDGEDB_INSTANCE);
    } catch {
      await migrateDatabase(TEST_EDGEDB_INSTANCE);
    }
  }

  const { e, run } = await import('@kickjump/db');
  await run(e.delete(e.Object));

  return async () => {
    // Delete everything!
    await run(e.delete(e.Object));
  };
}
