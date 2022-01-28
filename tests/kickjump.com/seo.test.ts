import { expect, test } from '@playwright/test';

test('the site displays the correct meta', async ({ page }) => {
  await page.goto('/');
  await expect(page.title()).resolves.toBe('KickJump');
});
