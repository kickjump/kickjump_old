import { GitHubData } from '@kickjump/mocks';
import { type Page, test } from '@kickjump/playwright';

import { STORAGE_STATE } from '../setup/utils.js';

test.describe('saved state in page', () => {
  test.use({ storageState: STORAGE_STATE });

  test('should recognise logged in state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('"Logout"').isVisible();
  });
});

test('can login with github', async ({ page, baseURL }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('"Login"').click();
  await mockGitHubLoginFlow(page, baseURL);
  await page.locator('"Logout"').isVisible();
});

async function mockGitHubLoginFlow(page: Page, baseURL: string | undefined) {
  const githubLoginUrl = new URL(page.url());
  const returnToUrl = new URL(
    githubLoginUrl.searchParams.get('return_to') ?? '',
    githubLoginUrl.origin,
  );

  const url = new URL('/auth/callback/github', baseURL);
  const state = returnToUrl.searchParams.get('state') ?? '';
  const code = GitHubData.USERS.octocat.auth.code;
  url.searchParams.set('code', code);
  url.searchParams.set('state', state);

  await page.goto(url.href);
  await page.waitForLoadState('networkidle');
}
