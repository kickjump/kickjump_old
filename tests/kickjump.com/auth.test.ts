import { GitHubData } from '@kickjump/mocks';
import { type Page, test } from '@kickjump/playwright';

import { STORAGE_STATE } from '../setup/utils.js';

test.describe('saved state in page', () => {
  test.use({ storageState: STORAGE_STATE });

  test('should recognise logged in state', async ({ page, queries }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await queries.getByText('Logout');
  });
});

test('can login with github', async ({ page, queries, baseURL }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loginButton = await queries.getByText('Login');
  await loginButton.click();
  await page.waitForLoadState('networkidle');
  await mockGitHubLoginFlow(page, baseURL);
  await queries.getByText('Logout');
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
