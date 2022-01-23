import { setup } from 'jest-process-manager';

async function globalSetup() {
  // Use an external endpoint.
  if (process.env.WEBSITE_URL) {
    return;
  }

  await setup({
    command: `PORT=3030 pnpm dev`,
    launchTimeout: 60_000,
    port: 3030,
    usedPortAction: 'ignore',
    debug: !!process.env.DEBUG,
  });
}

export default globalSetup;
