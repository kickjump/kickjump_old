import { expect, test } from '@kickjump/playwright';

import { externalLinks, seo } from './utils.js';

for (const [path, title] of seo) {
  test(`the site displays the correct metadata for '${path}'`, async ({ page }) => {
    await page.goto(path);
    await expect(page.title()).resolves.toBe(title);
  });
}

for (const [label, redirect] of externalLinks) {
  test(`the site redirects when clicking the ${label} footer link`, async ({ context, page }) => {
    await page.goto('/');
    const link = page.locator(`[aria-label="${label}"]`);
    const [newPage] = await Promise.all([context.waitForEvent('page'), link.click()]);

    await page.waitForLoadState();
    expect(newPage.url()).toBe(redirect);
  });
}
