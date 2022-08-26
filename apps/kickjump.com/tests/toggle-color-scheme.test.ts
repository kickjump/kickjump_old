import { expect, test } from '@kickjump/test/playwright';

test.describe('light mode', () => {
  test.use({ colorScheme: 'light' });

  test('can toggle between light and dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('[aria-label="Dark Mode Toggle"]').click();
    await expect(page.locator('html[data-theme=dark]').isVisible()).resolves.toBe(true);

    await page.locator('[aria-label="Light Mode Toggle"]').click();
    await expect(page.locator('html[data-theme=light]').isVisible()).resolves.toBe(true);
  });
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('can toggle between dark and light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('[aria-label="Light Mode Toggle"]').click();
    await expect(page.locator('html[data-theme=light]').isVisible()).resolves.toBe(true);

    await page.locator('[aria-label="Dark Mode Toggle"]').click();
    await expect(page.locator('html[data-theme=dark]').isVisible()).resolves.toBe(true);
  });
});
