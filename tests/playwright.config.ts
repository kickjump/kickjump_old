import type { PlaywrightTestConfig } from '@kickjump/playwright';

process.env.VITE_ENDPOINT_MOCKING_ENABLED = 'true';
const baseURL = process.env.WEBSITE_URL ?? 'http://localhost:3030';
process.env.EDGEDB_INSTANCE = 'kjtestdb';

const config: PlaywrightTestConfig = {
  use: { baseURL, trace: 'retain-on-failure' },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  globalSetup: './setup/kickjump.com-setup.ts',
  globalTeardown: './setup/kickjump.com-teardown.ts',
  reporter: process.env.CI ? 'dot' : 'list',
  testMatch: ['kickjump.com/*.test.ts'],
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
