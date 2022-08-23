import * as fs from 'node:fs/promises';
import * as path from 'node:path';

console.log('copy built svelte files');
const SRC_FOLDER = new URL('../src/', import.meta.url);
const DIST_FOLDER = new URL('../dist/', import.meta.url);
const svelteFiles: string[] = [];

// Collect the svelte files.
for (const name of await fs.readdir(SRC_FOLDER)) {
  if (name.endsWith('.svelte')) {
    svelteFiles.push(new URL(name, SRC_FOLDER).pathname);
  }
}

const copyFilePromises: Array<Promise<void>> = [];

try {
  await fs.mkdir(DIST_FOLDER);
} catch {
  //
}

for (const absolute of svelteFiles) {
  const target = new URL(path.basename(absolute), DIST_FOLDER);
  const promise = fs.copyFile(absolute, target);
  copyFilePromises.push(promise);
}

await Promise.all(copyFilePromises);
console.log('🎉 copied svelte files!');
