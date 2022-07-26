import AxeBuilder from '@axe-core/playwright'; // 1
import { expect, test } from '@playwright/test';

import { seo } from './utils.js';

const Axe = (AxeBuilder as any).default as typeof AxeBuilder;

for (const [path] of seo) {
  test.fixme(`'${path}' should be accessible`, async ({ page }) => {
    await page.goto(path);
    const accessibilityScanResults = await new Axe({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
}
