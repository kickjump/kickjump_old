/**
 * https://github.com/sveltejs/kit/issues/4261
 */

import type { Package } from '@manypkg/get-packages';
import { getPackages } from '@manypkg/get-packages';
import { sort } from 'fast-sort';
import { loadJsonFile } from 'load-json-file';
import { writeJsonFile } from 'write-json-file';

const DIR = new URL('../../..', import.meta.url).pathname;
const PACKAGE_JSON_PATH = new URL('../package.json', import.meta.url).pathname;
const packageJson = await loadJsonFile<Package['packageJson']>(PACKAGE_JSON_PATH);
const devDependencies = packageJson.devDependencies ?? {};
const devDependencyNames = new Set(Object.keys(devDependencies));
const dependencies: Record<string, string> = {};
const packages = (await getPackages(DIR)) ?? [];

for (const pkg of packages?.packages ?? []) {
  if (!devDependencyNames.has(pkg.packageJson.name)) {
    continue;
  }

  const { dir, packageJson } = pkg;
  const deps = { ...packageJson.dependencies };

  for (const [name, version] of Object.entries(deps)) {
    if (devDependencyNames.has(name) || dependencies[name]) {
      continue;
    }

    dependencies[name] = version;
  }
}

const sortedDependencies = Object.fromEntries(
  sort(Object.entries(dependencies)).asc((val) => val[0]),
);

if (JSON.stringify(sortedDependencies) !== JSON.stringify(packageJson.dependencies)) {
  console.log('Hoisting dependencies to sveltekit app');
  packageJson.dependencies = sortedDependencies;
  await writeJsonFile(PACKAGE_JSON_PATH, packageJson, { detectIndent: true });
}
