import { test as base } from '@playwright/test';

import { installPolyfills } from './polyfills.js';
import { typist } from './typist.js';

export * from '@playwright/test';

installPolyfills();

export interface Fixtures {
  type: ReturnType<typeof typist>;
}

export const test = base.extend<Fixtures>({
  type: ({ page }, use) => use(typist({ page })),
});

export const { expect } = test;
