// import pluginWasm from '@rollup/plugin-wasm';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

// import wasm from 'vite-plugin-wasm';
// import tsconfigPaths from 'vite-tsconfig-paths';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({ postcss: true }), mdsvex(mdsvexConfig)],
  compilerOptions: {},
  kit: {
    // routes: (filepath) => !/(?:^_|\/_)|(?:^\.|\/\.)(?!well-known|external)/.test(filepath),
    adapter: adapter(),
  },
};

export default config;
