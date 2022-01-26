import { setup } from 'jest-process-manager';

async function globalSetup() {
  // Use an external endpoint.
  if (process.env.WEBSITE_URL) {
    return;
  }

  await setup({
    command: 'pnpm next dev --port=3030',
    launchTimeout: 90_000,
    port: 3030,
    usedPortAction: 'ignore',
    debug: !!process.env.DEBUG,
  });
}

export default globalSetup;
