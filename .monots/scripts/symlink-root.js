/**
 * @script
 *
 * This is left as a JavaScript file since it is called in the `preinstall` hook
 * before any packages have been installed. It only has access to the `node`
 * internals.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

const targets = fs
  .readdirSync(baseDir('.monots', 'symlink'))
  // Exclude the `readme.md` file from being symlinked.
  .filter((filename) => !filename.endsWith('readme.md'))
  .map((filename) => ({
    original: baseDir('.monots', 'symlink', filename),
    target: baseDir(filename),
  }));

/**
 * Resolve a path relative to the base directory.
 *
 * @param {string[]} paths
 */
function baseDir(...paths) {
  return path.resolve(__dirname, '../..', ...paths);
}

/**
 * Safely get the stats for a file.
 *
 * @param {string} target
 */
function getFileStatSync(target) {
  try {
    return fs.lstatSync(target);
  } catch {
    return;
  }
}

/**
 * Delete a file or folder recursively.
 *
 * @param {string} filepath
 *
 * @returns {void}
 */
function deletePath(filepath) {
  const stat = getFileStatSync(filepath);

  if (!stat) {
    return;
  }

  if (stat.isFile()) {
    console.log('deleting file', filepath);
    fs.unlinkSync(filepath);
  }

  if (!stat.isDirectory()) {
    return;
  }

  // Delete all nested paths
  for (const file of fs.readdirSync(filepath)) {
    deletePath(path.join(filepath, file));
  }

  // Delete the directory
  fs.rmdirSync(filepath);
}

/**
 * Check that the path is linked to the target.
 *
 * @param {string} filepath
 * @param {string} target
 */
function isLinkedTo(filepath, target) {
  try {
    const checkTarget = fs.readlinkSync(filepath);
    return checkTarget === target;
  } catch {
    return false;
  }
}

for (const { original, target } of targets) {
  const targetStat = getFileStatSync(target);

  // Nothing to do since the path is linked correctly.
  if (isLinkedTo(target, original)) {
    continue;
  }

  // The file or directory exists but is not symlinked correctly. It should be
  // deleted.
  if (targetStat) {
    console.log('deleting path', target);
    deletePath(target);
  }

  fs.symlinkSync(original, target);
}

console.log(
  '\n\u001B[32mSuccessfully symlinked the `support/root` files to the root directory.\u001B[0m\n',
);
