import { test as base } from '@playwright/test';

import { installPolyfills } from './polyfills.js';
import { type TestingLibraryFixtures, fixtures } from './testing-library.js';
import { typist } from './typist.js';

export * from '@playwright/test';

installPolyfills();

export interface Fixtures extends TestingLibraryFixtures {
  type: ReturnType<typeof typist>;
}

export const test = base.extend<Fixtures>({
  ...fixtures,
  type: ({ page }, use) => use(typist({ page })),
});

export const { expect } = test;
