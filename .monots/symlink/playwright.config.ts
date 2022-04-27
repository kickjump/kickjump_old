import viteComponentTests from '@playwright/experimental-ct-svelte/vitePlugin';
import { type PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: ['apps/kickjump.com/**/*.test.ts'],
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }]] : [['html', { open: 'on-failure' }]],
  plugins: [viteComponentTests()],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
};

export default config;
