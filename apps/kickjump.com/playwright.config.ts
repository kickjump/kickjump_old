import type { PlaywrightTestConfig } from '@playwright/experimental-ct-svelte';
import * as path from 'node:path';

process.env.VITE_ENDPOINT_MOCKING_ENABLED = 'true';
const baseURL = process.env.WEBSITE_URL ?? 'http://localhost:3030';
process.env.EDGEDB_INSTANCE = 'kjtestdb';
const componentsOnly = process.env.COMPONENTS_ONLY === 'true';

const config: PlaywrightTestConfig = {
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ctViteConfig: {
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
      optimizeDeps: { esbuildOptions: { target: 'esnext' } },
    },
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  globalSetup: componentsOnly
    ? undefined
    : '../../packages/kickjump__test/setup/kickjump.com-setup.ts',
  globalTeardown: componentsOnly
    ? undefined
    : '../../packages/kickjump__test/setup/kickjump.com-teardown.ts',
  reporter: process.env.CI ? 'dot' : 'list',
  testMatch: componentsOnly ? ['tests/components/*.test.ts'] : ['tests/**/*.test.ts'],
  timeout: 30_000,
  workers: 1,
};

if (process.env.E2E_FULL) {
  config.projects = [
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } },
    },
  ];
}

export default config;
