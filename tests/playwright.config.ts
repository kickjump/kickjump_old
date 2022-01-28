/* eslint-disable unicorn/prefer-module */
import { type PlaywrightTestConfig, devices } from '@playwright/test';
import { createRequire } from 'node:module';

process.env.TEST = '1';

const projects: PlaywrightTestConfig['projects'] = !process.env.E2E_QUICK
  ? [
      {
        name: 'Desktop Chromium',
        use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } },
      },
      {
        name: 'Desktop Safari',
        use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } },
      },
      {
        name: 'Desktop Firefox',
        use: { browserName: 'firefox', viewport: { width: 1280, height: 720 } },
      },
      { name: 'Mobile Chrome', use: devices['Pixel 5'] },
      { name: 'Mobile Safari', use: devices['iPhone 12'] },
    ]
  : undefined;

const require = createRequire(import.meta.url);
const config: PlaywrightTestConfig = {
  use: { baseURL: process.env.WEBSITE_URL ?? 'http://localhost:3030' },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  globalSetup: require.resolve('./setup/kickjump.com-setup.js'),
  globalTeardown: require.resolve('./setup/kickjump.com-teardown.js'),
  reporter: process.env.CI ? 'dot' : 'list',
  testMatch: ['kickjump.com/*.test.ts'],
  timeout: 60_000,
  projects,
};

export default config;
