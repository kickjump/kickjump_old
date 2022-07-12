import { sveltekit } from '@sveltejs/kit/vite';
import * as path from 'node:path';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  mode: process.env.VITE_MODE ? process.env.MODE : undefined,
  plugins: [
    // vitePluginWasm(['@kickjump/scraper']),
    precompileIntl('locales'), // if your translations are defined in /locales/[lang].json,
    topLevelAwait(),
    sveltekit(),
  ],
  // ...
  define: {},
  /* 'process.env.BROWSER': true, */

  optimizeDeps: {
    // include: ['@kickjump/scraper'],
    // include: ['@project-serum/anchor', '@solana/web3.js', 'buffer'],
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
});
