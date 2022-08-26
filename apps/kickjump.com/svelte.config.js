import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [preprocess({ postcss: true }), mdsvex(mdsvexConfig)],
  compilerOptions: {},
  kit: {
    adapter: adapter(),
    outDir: process.env.VITE_ENDPOINT_MOCKING_ENABLED === 'true' ? '.svelte-kit-test' : undefined,
  },
};

export default config;
