import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * Get a path relative to the base directory of this project. If called with no
 * arguments it will return the base directory.
 */
export function baseDir(...paths: string[]): string {
  return path.resolve(__dirname, '..', path.join(...paths));
}
