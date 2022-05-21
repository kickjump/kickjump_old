import { loadJsonFile } from 'load-json-file';
import chalk from 'chalk-template';
import { writeJsonFile } from 'write-json-file';

import { baseDir } from './helpers.js';

const FAST_SORT_PACKAGE_JSON = baseDir('apps/kickjump.com/node_modules/fast-sort/package.json');
const json: Record<string, unknown> = await loadJsonFile(FAST_SORT_PACKAGE_JSON);

if (!json.exports) {
  json.main = 'dist/sort.js';
  json.module = 'dist/sort.es.js';
  json.type = 'module';
  json.exports = {
    '.': { import: './dist/sort.es.js', require: './dist/sort.js', types: './dist/sort.d.ts' },
    './package.json': './package.json',
  };

  console.log(chalk`{green Updated package.json file }`);
  await writeJsonFile(FAST_SORT_PACKAGE_JSON, json, { detectIndent: true });
}
