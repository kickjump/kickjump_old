import { expect, test } from '@kickjump/playwright';

import { STORAGE_STATE } from '../setup/utils.js';
import { loginWithGitHub } from './utils.js';

test.describe('saved state in page', () => {
  test.use({ storageState: STORAGE_STATE });

  test('should recognise logged in state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('"Logout"').isVisible();
  });

  test('it can logout', async ({ page, baseURL }) => {
    page.goto('/about');
    await page.waitForLoadState('networkidle');
    await Promise.all([page.locator('"Logout"').click(), page.waitForLoadState('networkidle')]);
    expect(page.url()).toBe(`${baseURL}/`);
    await page.locator('"Login"').isVisible();
  });
});

test('can login with github', async ({ page, baseURL }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await Promise.all([page.locator('"Login"').click(), page.waitForNavigation()]);
  await page.locator('"Login with GitHub"').click();
  await loginWithGitHub({ page, baseURL });
  await page.locator('"Logout"').isVisible();
});
