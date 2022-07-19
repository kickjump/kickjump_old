import { expect, test } from '@kickjump/playwright';
import retry from 'p-retry';

test.describe('light mode', () => {
  test.use({ colorScheme: 'light' });

  test('can toggle between light and dark mode', async ({ page, queries }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await retry(
      async () => {
        const $toggler = await queries.getByLabelText('Dark Mode Toggle');
        await $toggler.click();
        const darkHtml = await page.locator('html[data-theme=dark]');
        await expect(darkHtml?.isVisible()).resolves.toBe(true);
      },
      { retries: 8 },
    );

    const $toggler = await queries.getByLabelText('Light Mode Toggle');
    await $toggler.click();

    const lightHtml = await page.locator('html[data-theme=light]');
    await expect(lightHtml?.isVisible()).resolves.toBe(true);
  });
});

test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('can toggle between dark and light mode', async ({ page, queries }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await retry(
      async () => {
        const $toggler = await queries.getByLabelText('Light Mode Toggle');
        await $toggler.click();
        const darkHtml = await page.locator('html[data-theme=light]');
        await expect(darkHtml?.isVisible()).resolves.toBe(true);
      },
      { retries: 8 },
    );

    const $toggler = await queries.getByLabelText('Dark Mode Toggle');
    await $toggler.click();

    const lightHtml = await page.locator('html[data-theme=dark]');
    await expect(lightHtml?.isVisible()).resolves.toBe(true);
  });
});
