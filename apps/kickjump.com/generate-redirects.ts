import { lstat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { REDIRECTS } from './src/lib/utils/constants';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_DIRECTORY = path.join(__dirname, '.svelte-kit/cloudflare');
const TARGET_FILE_PATH = path.join(TARGET_DIRECTORY, '_redirects');
const CONTENT = Object.entries(REDIRECTS)
  .map(([from, { to, status }]) => `${from} ${to} ${status}`)
  .join('\n');

try {
  const stat = await lstat(TARGET_DIRECTORY);

  if (!stat.isDirectory()) {
    throw {};
  }

  await writeFile(TARGET_FILE_PATH, CONTENT);
  console.log('Successfully generated redirects.');
} catch {
  console.error('Not a cloudflare deployment: `_redirects` NOT created.');
}
