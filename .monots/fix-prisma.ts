import { baseDir } from './helpers';
import fs from 'node:fs/promises';

const TARGET = baseDir('packages/kickjump__db/src/generated/index.js');

/**
 * Fix a problem in using prisma in the monorepo.
 */
async function main() {
  const source = await fs.readFile(TARGET, { encoding: 'utf-8' });
  const updated = source.replace(
    /process\.cwd\(\)/g,
    JSON.stringify(baseDir('packages/kickjump__db')),
  );

  await fs.writeFile(TARGET, updated);
  console.log('Successfully fixed prisma cwd().');
}

main();
