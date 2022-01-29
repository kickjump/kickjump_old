import { teardown } from 'jest-process-manager';

async function globalTeardown() {
  // Use an external endpoint.
  if (process.env.WEBSITE_URL) {
    return;
  }

  await teardown();
}

export default globalTeardown;
