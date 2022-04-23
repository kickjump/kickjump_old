import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import path from 'node:path';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import preprocess from 'svelte-preprocess';

import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],

  experimental: {
    // prebundleSvelteLibraries: true,
  },

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
    mdsvex(mdsvexConfig),
  ],

  kit: {
    adapter: adapter(),
    vite: {
      plugins: [
        precompileIntl('locales'), // if your translations are defined in /locales/[lang].json
      ],
      // ...
      define: {
        'process.env.BROWSER': true,
      },

      optimizeDeps: {
        // include: ['@project-serum/anchor', '@solana/web3.js', 'buffer'],
        include: ['@kickjump/db > @kickjump/prisma'],
      },

      resolve: {
        alias: {
          $components: path.resolve('./src/lib/components'),
          $directives: path.resolve('./src/lib/directives'),
          $lib: path.resolve('./src/lib'),
          $server: path.resolve('./src/lib/server'),
          $types: path.resolve('./src/lib/types'),
          $utils: path.resolve('./src/lib/utils'),
        },
      },
    },
  },
};

export default config;
