import { baseDir } from './helpers';
import chalk from 'chalk-template';
import fs from 'node:fs/promises';

const TARGET = baseDir('packages', 'kickjump__prisma', 'dist', 'index.js');

/**
 * Fix a problem in using prisma in the monorepo.
 */
async function main() {
  console.log(chalk`Fixing {bold prisma} in {bold ${TARGET}}`);
  const source = await fs.readFile(TARGET, { encoding: 'utf-8' });
  const updated = source.replace(
    /process\.cwd\(\)/g,
    JSON.stringify(baseDir('packages/kickjump__prisma')),
  );

  await fs.writeFile(TARGET, updated);
  console.log(chalk`{green Successfully fixed prisma cwd(). }`);
}

main();
