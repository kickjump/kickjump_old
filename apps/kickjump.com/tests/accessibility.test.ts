import { Axe, expect, test } from '@kickjump/test/playwright';

import { seo } from './utils.js';

for (const [path] of seo) {
  test.fixme(`'${path}' should be accessible`, async ({ page }) => {
    await page.goto(path);
    const accessibilityScanResults = await new Axe({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
}
