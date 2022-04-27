/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

const config = defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./tests/setup/react-setup.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
    watchIgnore: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*', '.*\\/postgres-data\\/.*'],
  },
});

export default config;
