import { expect, test } from '@playwright/test';

test('creates a token', async ({ page }) => {
  await page.goto('/create-token');
  await expect(page.title()).resolves.toBe('Create Token | KickJump');
});
