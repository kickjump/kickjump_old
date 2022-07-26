import { execa } from 'execa';

const directory = new URL('../../packages/kickjump__edgedb', import.meta.url).pathname;

/**
 * Setup a database by name.
 */
export async function setupDatabase(name: string) {
  await execa('pnpm', ['--dir', directory, 'db:create', name], { stdio: 'inherit' });
  await migrateDatabase(name);
}

export async function migrateDatabase(name: string) {
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
export const STORAGE_STATE = 'tmp/octocat.json';
