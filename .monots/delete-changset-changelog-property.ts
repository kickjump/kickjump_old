/**
 * @script
 *
 * This script edits the `/.changeset/config.json` file so that it doesn't need
 * the GITHUB_TOKEN to be available in order to build the changeset.
 *
 * This allows PR's which don't have access to the `GITHUB_TOKEN` to still pass.
 */

import { loadJsonFile } from 'load-json-file';
import { writeJsonFile } from 'write-json-file';
import path from 'node:path';
import chalk from 'chalk';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * Get a path relative to the base directory of this project. If called with no
 * arguments it will return the base directory.
 */
function baseDir(...paths: string[]): string {
  return path.resolve(__dirname, '..', path.join(...paths));
}

async function main() {
  if (!process.env.CI) {
    console.log(chalk.red('Attempted to edit the changeset config in a non CI environment.'));
    console.log('Exiting...');

    return;
  }

  const changesetConfig = await loadJsonFile<object>(baseDir('.changeset', 'config.json'));

  Reflect.deleteProperty(changesetConfig, 'changelog');
  await writeJsonFile(baseDir('.changeset', 'config.json'), changesetConfig);

  console.log(chalk.green.bold('Successfully updated the CI configuration.'));
}

main();