import { test } from '@kickjump/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/projects');
});

test('the project page shows a list of projects', async ({ page }) => {
  await page.locator('"Projects List"').isVisible();
});
