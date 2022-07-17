import { execa } from 'execa';
// import { randomBytes } from 'node:crypto';
// import retry from 'p-retry';

const directory = new URL('../../packages/kickjump__edgedb', import.meta.url).pathname;

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
    await setupDatabase(TEST_EDGEDB_INSTANCE);
  }

  return async () => {
    // maybe remove the data
  };
}

/**
 * Setup a database by name.
 */
export async function setupDatabase(name: string) {
  await execa('pnpm', ['--dir', directory, 'db:create', name], { stdio: 'inherit' });
  await execa('pnpm', ['--dir', directory, 'migrate:run', '--instance', name], {
    stdio: 'inherit',
  });
}

/**
 * Teardown the provided database
 */
export async function teardownDatabase(name: string) {
  await execa('pnpm', ['--dir', directory, 'db:remove', name], { stdio: 'inherit' });
}

interface Instance {
  name: string;
  port: number;
  version: string;
  'service-status': string;
}

export async function getInstances(): Promise<Instance[]> {
  try {
    const { stdout } = await execa('edgedb', ['instance', 'list', '--json']);
    return JSON.parse(stdout) ?? [];
  } catch {
    return [];
  }
}

export async function instanceExists(name: string): Promise<boolean> {
  const instances = await getInstances();

  for (const instance of instances) {
    if (instance.name === name) {
      return true;
    }
  }

  return false;
}

export const TEST_EDGEDB_INSTANCE = 'kickjump__testdb';
