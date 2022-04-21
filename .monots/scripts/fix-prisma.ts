import { baseDir, exec } from './helpers';
import chalk from 'chalk-template';
import fs from 'node:fs/promises';

const TARGET_JS = baseDir('packages', 'kickjump__prisma', 'dist', 'index.js');
const TARGET_PRISMA = baseDir('packages', 'kickjump__prisma', 'schema.prisma');
const OPENING_PATTERN = `// => CLIENT START`;
const END_PATTERN = `// => CLIENT END`;
const RUST_PRISMA_TEMPLATE = `\
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  referentialIntegrity = "prisma"
}

generator client {
  provider      = "prisma rust"
  output        = "../../crates/db/src/prisma.rs"
  binaryTargets = ["native"]
  previewFeatures = ["referentialIntegrity"]
}`;

/**
 * Fix a problem in using prisma in the monorepo.
 */
async function main() {
  console.log(chalk`Fixing {bold prisma} in {bold ${TARGET_JS}}`);
  const source = await fs.readFile(TARGET_JS, { encoding: 'utf-8' });
  const updated = source.replace(
    /process\.cwd\(\)/g,
    JSON.stringify(baseDir('packages/kickjump__prisma')),
  );

  await fs.writeFile(TARGET_JS, updated);
  console.log(chalk`{green Successfully replaced prisma \`process.cwd()\`. }`);

  const prismaFileSource = await fs.readFile(TARGET_PRISMA, { encoding: 'utf-8' });
  const startingIndex = prismaFileSource.indexOf(OPENING_PATTERN);
  const endingIndex = prismaFileSource.indexOf(END_PATTERN) + END_PATTERN.length;
  const updatedPrisma = `${prismaFileSource.substring(
    0,
    startingIndex,
  )}${OPENING_PATTERN}\n${RUST_PRISMA_TEMPLATE}\n\n${END_PATTERN}${prismaFileSource.substring(
    endingIndex,
  )}`;

  try {
    console.log(chalk`{grey Creating rust bindings from prisma file }`);
    await fs.writeFile(TARGET_PRISMA, updatedPrisma);
    const { stdout, stderr } = await exec(
      `pnpm --dir ${baseDir('packages/kickjump__prisma')} prisma generate`,
    );

    if (stdout) {
      console.log(stdout);
      console.log(chalk`{green Yay! successfully generated bindings 🎉 }`);
    } else {
      console.error(stderr);
    }
  } finally {
    // Restore original file
    console.log(chalk`{grey Restoring original prisma file }`);
    await fs.writeFile(TARGET_PRISMA, prismaFileSource);
  }
}

main();
