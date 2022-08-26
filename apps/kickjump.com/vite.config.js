import { sveltekit } from '@sveltejs/kit/vite';
import * as path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: ['es2022'] },
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: path.resolve('./src/lib/components'),
      $layout: path.resolve('./src/lib/layout'),
      $stores: path.resolve('./src/lib/stores'),
      $modules: path.resolve('./src/lib/modules'),
      $server: path.resolve('./src/lib/server'),
      $types: path.resolve('./src/lib/types'),
      $utils: path.resolve('./src/lib/utils'),
      $lib: path.resolve('./src/lib'), // Keep for playwright component tests
    },
  },
  server: { port: 3000 },
  optimizeDeps: { esbuildOptions: { target: 'esnext' } },
});
