import { expect, test } from '@kickjump/playwright';

import { STORAGE_STATE } from '../setup/utils.js';
import { loginWithGitHub } from './utils.js';

test('the project page shows a list of projects', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('"Projects List"').isVisible();
});

test.describe('authenticated', () => {
  test.use({ storageState: STORAGE_STATE });

  test('can create', async ({ page, baseURL }) => {
    await page.goto('/create');
    await page.waitForLoadState('networkidle');
    const nameField = page.locator('input[name="name"]');
    const editorField = page.locator('textarea');
    const button = page.locator('text="Create"');

    await nameField.type('my-project', { delay: 10 });
    await editorField.type(
      '# Heading \n\nThis is the best way to type stuff that must be at least 50 characters!!',
      { delay: 1 },
    );
    await button.click();
    await page.waitForNavigation();
    expect(page.url()).toBe(new URL('/my-project/edit', baseURL).href);
  });

  test('404 with non-existent page', async ({ page }) => {
    await page.goto('/does-not-exist');
    const status = page.locator('"404"');
    await expect(status.isVisible()).resolves.toBe(true);
  });
});

test.describe('unauthenticated', () => {
  test('creating a project requires login', async ({ page, baseURL }) => {
    await page.goto('/create');
    expect(page.url()).toBe(new URL('/login?redirect=/create', baseURL).href);
    await page.locator('"Login with GitHub"').click();
    await page.waitForNavigation();
    expect(new URL(page.url()).origin).toBe('https://github.com');
    await loginWithGitHub({ baseURL, page, user: 'ahmed' });
    expect(page.url()).toBe(new URL('/create', baseURL).href);
  });
});
