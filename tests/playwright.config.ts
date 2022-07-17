import type { PlaywrightTestConfig } from '@kickjump/playwright';

process.env.TEST = '1';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.WEBSITE_URL ?? 'http://localhost:3030',
    headless: process.env.E2E_DEBUG === '1' ? false : true,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  globalSetup: './setup/kickjump.com-setup.ts',
  globalTeardown: './setup/kickjump.com-teardown.ts',
  globalTimeout: 60_000,
  reporter: process.env.CI ? 'dot' : 'list',
  testMatch: ['kickjump.com/*.test.ts'],
  timeout: 60_000,
};

if (!process.env.WEBSITE_URL) {
  config.webServer = {
    command: 'pnpm -w dev:kickjump.com --port 3030 &> /dev/null',
    port: 3030,
    // url: 'http://localhost',
    timeout: 60_000,
  };
}

if (process.env.E2E_FULL) {
  config.projects = [
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } },
    },
  ];
}

export default config;
