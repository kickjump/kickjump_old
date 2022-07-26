/* eslint-disable unicorn/no-process-exit */
import { readFile } from 'node:fs/promises';
import { appendFile, readdir } from 'node:fs/promises';

let VERSION = 0;
const MIGRATION_DIR = new URL('../dbschema/migrations', import.meta.url);
const TYPES_DTS = new URL('../dist/types.d.ts', import.meta.url);
const TYPES_ESM = new URL('../dist/types.mjs', import.meta.url);

try {
  const migrations = await readdir(MIGRATION_DIR);
  VERSION = Math.max(
    ...migrations
      .filter((migration) => migration.endsWith('.edgeql'))
      .map((migration) => Number.parseInt(migration.replace('.edgeql', ''), 10)),
  );

  const contents = await readFile(TYPES_ESM, { encoding: 'utf8' });

  if (contents.includes('export const VERSION = ')) {
    process.exit(0);
  }

  await appendFile(
    TYPES_DTS,
    `/** The latest migration version. This can be used to keep track of the most recent version when fields on a database model are changed. */\nexport const VERSION: ${VERSION};\n`,
  );
  await appendFile(TYPES_ESM, `export const VERSION = ${VERSION};\n`);
} catch (error) {
  console.log(error);
  console.log('could not append version constant to types.mjs');
}
