// @ts-check

import { mangleScopedPackageName } from '@monots/utils';
import { resolve } from 'import-meta-resolve';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path/posix';
import { fileURLToPath } from 'node:url';

const WASM_URL_REGEX = /input = new URL\('(.+)'.+;/g;
const WASM_FILENAME_REGEX = /input = '(\/.+)';/g;

/**
 * @typedef {Object} WasmPackage
 * @property {string} package - the package
 * @property {string[]} paths - the relative paths to wasm files in the package.
 */

/**
 * @param {string[]} entrypoints - the entrypoints to wasm files
 *
 * @returns {import('vite').PluginOption}
 */
export default function vitePluginWasm(entrypoints) {
  /**
   * The basename / filename is the key and the absolute path to the wasm file
   * is the value.
   *
   * @type {Map<string, string>}
   */
  const map = new Map();

  /** @type {import('vite').ResolvedConfig} */
  let config;

  return {
    name: 'vite-plugin-wasm',
    enforce: 'pre',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async buildStart() {
      /** @type {Promise<void>[]} */
      const promises = [];

      for (const entrypoint of entrypoints) {
        console.log({ entrypoint });
        const basename = mangleScopedPackageName(entrypoint).split('/').join('__');

        const promise = resolve(entrypoint, import.meta.url)
          .then((entrypointPath) => {
            entrypointPath = fileURLToPath(entrypointPath);
            return Promise.all([readFile(entrypointPath, { encoding: 'utf8' }), entrypointPath]);
          })
          .then(([code, entrypointPath]) => {
            code = code.replace(WASM_URL_REGEX, (_match, relativePath) => {
              console.log('replacing', _match, relativePath);
              const filename = `${basename}__${path
                .normalize(relativePath)
                .split('/')
                .join('-_-')}`;
              const absolutePath = path.join(path.dirname(entrypointPath), relativePath);
              map.set(filename, absolutePath);
              console.log({ filename, absolutePath });

              return `input = '${path.posix.join(config.base, config.build.assetsDir, filename)}';`;
            });

            const capture = code.match(WASM_FILENAME_REGEX)?.[1];

            if (capture) {
              const filename = path.basename(capture);
              const relativePath = filename.split('__').at(-1).split('-_-').join('/');
              const absolutePath = path.join(path.dirname(entrypointPath), relativePath);
              console.log({ filename, absolutePath });
              map.set(filename, absolutePath);
            }

            return writeFile(entrypointPath, code);
          });

        promises.push(promise);
      }

      await Promise.all(promises);
    },

    configureServer({ middlewares }) {
      return () => {
        middlewares.use((req, res, next) => {
          if (typeof req.url !== 'string') {
            return;
          }

          const basename = path.basename(req.url);
          const filepath = map.get(basename);
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

          if (!basename.endsWith('.wasm') || !filepath) {
            return next();
          }

          res.writeHead(200, { 'Content-Type': 'application/wasm' });
          createReadStream(filepath).pipe(res);
        });
      };
    },

    async buildEnd() {
      /** @type {Promise<void>[]} */
      const promises = [];

      for (const filename of map.values()) {
        const promise = readFile(filename).then((source) => {
          this.emitFile({ type: 'asset', fileName: `assets/${filename}`, source });
        });

        promises.push(promise);
      }

      await Promise.all(promises);
    },
  };
}

// function
