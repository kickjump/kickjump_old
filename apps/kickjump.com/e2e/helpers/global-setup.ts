import { setup } from 'jest-process-manager';

async function globalSetup() {
  // Use an external endpoint.
  if (process.env.WEBSITE_URL) {
    return;
  }

  await setup({
    command: process.env.CI
      ? `pnpm next build && pnpm next start --port=3030`
      : `pnpm next dev --port=3030`,
    launchTimeout: 60_000,
    port: 3030,
    usedPortAction: 'ignore',
    debug: !!process.env.DEBUG,
  });
}

export default globalSetup;
