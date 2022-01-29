import { setup } from 'jest-process-manager';

async function globalSetup() {
  // Use an external endpoint.
  if (process.env.WEBSITE_URL) {
    return;
  }

  await setup({
    command: process.env.TEST_BUILD === '1' ? 'pnpm start' : 'pnpm dev',
    launchTimeout: 60_000,
    port: 3030,
    usedPortAction: 'kill',
    debug: !!process.env.DEBUG,
  });
}

export default globalSetup;
