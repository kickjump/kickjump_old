import * as fs from 'node:fs/promises';

let VERSION = 0;
const MIGRATION_DIR = new URL('../dbschema/migrations', import.meta.url);
const TYPES_DTS = new URL('../dist/types.d.ts', import.meta.url);
const TYPES_ESM = new URL('../dist/types.mjs', import.meta.url);

try {
  const migrations = await fs.readdir(MIGRATION_DIR);
  VERSION = Math.max(
    ...migrations
      .filter((migration) => migration.endsWith('.edgeql'))
      .map((migration) => Number.parseInt(migration.replace('.edgeql', ''), 10)),
  );

  const [jsContents, dtsContents] = await Promise.all([
    fs.readFile(TYPES_ESM, { encoding: 'utf8' }),
    fs.readFile(TYPES_DTS, { encoding: 'utf8' }),
  ]);

  if (jsContents.includes('export const VERSION') || dtsContents.includes('export const VERSION')) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  }

  await Promise.all([
    fs.writeFile(
      TYPES_DTS,
      `${dtsContents}\n/** The latest migration version. This can be used to keep track of the most recent version when fields on a database model are changed. */\nexport const VERSION: ${VERSION};\n`,
    ),
    fs.writeFile(TYPES_ESM, `${jsContents}\nexport const VERSION = ${VERSION};\n`),
  ]);
} catch (error) {
  console.log(error);
  console.log('could not append version constant to types.mjs');
}
