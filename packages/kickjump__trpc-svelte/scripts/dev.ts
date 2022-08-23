import * as fs from 'node:fs/promises';
import * as path from 'node:path';

console.log('symlink svelte files');
const SRC_FOLDER = new URL('../src/', import.meta.url);
const DIST_FOLDER = new URL('../dist/', import.meta.url);
const svelteFiles: string[] = [];

// Collect the svelte files.
for (const name of await fs.readdir(SRC_FOLDER)) {
  if (name.endsWith('.svelte')) {
    svelteFiles.push(new URL(name, SRC_FOLDER).pathname);
  }
}

const symlinkPromises: Array<Promise<void>> = [];

try {
  await fs.mkdir(DIST_FOLDER);
} catch {
  //
}

for (const absolute of svelteFiles) {
  const target = new URL(path.basename(absolute), DIST_FOLDER);
  const promise = fs.symlink(absolute, target);
  symlinkPromises.push(promise);
}

await Promise.all(symlinkPromises);
console.log('🎉 symlinked svelte files!');
