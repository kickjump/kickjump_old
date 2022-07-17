import { test, expect } from '@kickjump/playwright';
import retry from 'p-retry'

test.describe('color scheme', () => {
  test.use({ colorScheme: 'light' });

test('can toggle between light and dark mode', async ({ page, queries, }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded');
  await retry(async (count) => {
    console.log({count})
    const $toggler = await queries.getByLabelText('Dark Mode Toggle Button');
    await $toggler.click();
    const darkHtml = await page.$('html[data-theme=dark]');
    await expect(darkHtml?.isVisible()).resolves.toBe(true);
  }, { retries: 5 })

  const $toggler = await queries.getByLabelText('Dark Mode Toggle Button');
  await $toggler.click();

  const lightHtml = await page.$('html[data-theme=light]');
  await expect(lightHtml?.isVisible()).resolves.toBe(true);
});

})
