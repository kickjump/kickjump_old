import type { PlaywrightTestConfig } from '@kickjump/playwright';

process.env.VITE_ENDPOINT_MOCKING_ENABLED = 'true';
const baseURL = process.env.WEBSITE_URL ?? 'http://localhost:3030';
process.env.EDGEDB_INSTANCE = 'kickjump__testdb';

const config: PlaywrightTestConfig = {
  use: { baseURL },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  globalSetup: './setup/kickjump.com-setup.ts',
  globalTeardown: './setup/kickjump.com-teardown.ts',
  globalTimeout: 50_000,
  reporter: process.env.CI ? 'dot' : 'list',
  testMatch: ['kickjump.com/*.test.ts'],
  timeout: 50_000,
};

// if (!process.env.CI) {
//   config.webServer = {
//     // command: 'WEBSITE_URL=1 VITE_ENDPOINT_MOCKING_ENABLED=true pnpm -w dev:kickjump.com --mode "e2e" --port 3030 &> /dev/null',
//     command:
//       'WEBSITE_URL="http://localhost:3030" VITE_ENDPOINT_MOCKING_ENABLED=true pnpm -w dev:kickjump.com --mode "e2e" --port 3030',
//     port: 3030,
//     timeout: 50_000,
//     reuseExistingServer: true,
//   };
// }

if (process.env.E2E_FULL) {
  config.projects = [
    {
      name: 'Desktop Chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } },
    },
  ];
}

export default config;
