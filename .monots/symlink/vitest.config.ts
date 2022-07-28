/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const config = defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['apps/kickjump.com/tsconfig.json'] }),
    svelte({ hot: !process.env.VITEST }),
  ],
  test: {
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx,svelte}'],
    setupFiles: ['./tests/setup/spec-setup.ts'],
    globalSetup: ['./tests/setup/global-spec-setup.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
    teardownTimeout: 5000,
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/(?:build|dist)\\/.*', '.*\\/postgres-data\\/.*'],
  },
  optimizeDeps: {entries: ['msw']}
});

export default config;
