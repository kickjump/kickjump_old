// import viteComponentTests from '@playwright/experimental-ct-svelte';
import { type PlaywrightTestConfig, devices } from '@playwright/test';
// import { svelte } from '@sveltejs/vite-plugin-svelte';
// import tsconfigPaths from 'vite-tsconfig-paths';

const config: PlaywrightTestConfig = {
  testMatch: ['tests/*.test.ts'],
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }]] : [['html', { open: 'on-failure' }]],

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
