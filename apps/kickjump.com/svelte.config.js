// import pluginWasm from '@rollup/plugin-wasm';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import path from 'node:path';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import preprocess from 'svelte-preprocess';
import topLevelAwait from 'vite-plugin-top-level-await';

// import wasm from 'vite-plugin-wasm';
// import tsconfigPaths from 'vite-tsconfig-paths';
import mdsvexConfig from './mdsvex.config.js';
import vitePluginWasm from './vite-wasm.mjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],

  experimental: {
    // prebundleSvelteLibraries: true,
  },

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({ postcss: true }), mdsvex(mdsvexConfig)],

  kit: {
    // routes: (filepath) => !/(?:^_|\/_)|(?:^\.|\/\.)(?!well-known|external)/.test(filepath),
    adapter: adapter(),
    vite: {
      mode: process.env.VITE_MODE ? process.env.MODE : undefined,
      plugins: [
        vitePluginWasm(['@kickjump/scraper']),
        precompileIntl('locales'), // if your translations are defined in /locales/[lang].json,
        topLevelAwait(),
      ],
      // ...
      define: {},
      /* 'process.env.BROWSER': true, */

      optimizeDeps: {
        include: ['@kickjump/scraper'],
        // include: ['@project-serum/anchor', '@solana/web3.js', 'buffer'],
        // include: ['@kickjump/prisma', '@kickjump/db > @kickjump/prisma'],
        // include: [
        //   'metascraper',
        //   'metascraper-author',
        //   'metascraper-clearbit',
        //   'metascraper-date',
        //   'metascraper-description',
        //   'metascraper-image',
        //   'metascraper-logo',
        //   'metascraper-publisher',
        //   'metascraper-title',
        //   'metascraper-url',
        // ],
      },

      resolve: {
        alias: {
          $components: path.resolve('./src/lib/components'),
          $layout: path.resolve('./src/lib/layout'),
          $stores: path.resolve('./src/lib/stores'),
          $actions: path.resolve('./src/lib/actions'),
          $server: path.resolve('./src/lib/server'),
          $types: path.resolve('./src/lib/types'),
          $utils: path.resolve('./src/lib/utils'),
          $lib: path.resolve('./src/lib'),
        },
      },
    },
  },
};

export default config;
