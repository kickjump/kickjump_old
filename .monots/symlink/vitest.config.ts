import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    svelte({
      hot: !process.env.VITEST,
      configFile: new URL('../../.monots/svelte.config.js', import.meta.url).pathname,
    }),
  ],
  test: {
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx,svelte}'],
    setupFiles: ['./packages/kickjump__test/setup/spec-setup.ts'],
    globalSetup: ['./packages/kickjump__test/setup/global-spec-setup.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
    teardownTimeout: 5000,
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/(?:build|dist)\\/.*', '.*\\/postgres-data\\/.*'],
  },

  optimizeDeps: { include: ['@project-serum/anchor'] },
});
