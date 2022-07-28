import './install-polyfills.js';

import { setupMocking } from '@kickjump/mocks';
import { afterAll, afterEach, beforeAll } from 'vitest';

// Clear the database data after each test.
afterEach(async () => {
  const { e, run } = await import('@kickjump/db');
  await run(e.delete(e.Object), { unsafeIgnorePolicies: true });
});

let disableMocking: (() => Promise<void>) | undefined;

// Start server before all tests
beforeAll(async () => {
  disableMocking = await setupMocking();
});

//  Close server after all tests
afterAll(async () => await disableMocking?.());
