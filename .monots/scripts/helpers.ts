import path from 'node:path';
import type { Package } from '@manypkg/get-packages';
import cp from 'node:child_process';
import { promisify } from 'node:util';

const __dirname = new URL('.', import.meta.url).pathname;

/**
 * Resolve a path relative to the base directory.
 *
 * @param {string[]} paths
 */
export function baseDir(...paths: string[]) {
  return path.resolve(__dirname, '../..', ...paths);
}

export type Pkg = Package['packageJson'] & {
  location: string;
};

export const exec = promisify(cp.exec);
