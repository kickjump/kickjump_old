import { GitHubData } from '@kickjump/mocks';
import type { Page } from '@playwright/test';

export const externalLinks = new Map([
  ['GitHub', 'https://github.com/kickjump/kickjump'],
  ['Discord', 'https://discord.com/invite/mzaFsAUn22'],
  ['Twitter', 'https://twitter.com/kickjumpco'],
]);

export const seo = new Map([
  ['/', 'KickJump'],
  ['/projects', 'Projects | KickJump'],
  ['/about', 'About | KickJump'],
]);

interface LoginWithGithubProps {
  page: Page;
  baseURL: string | undefined;
  /**
   * @default 'octocat'
   */
  user?: keyof typeof GitHubData.USERS | undefined;
}

export async function loginWithGitHub(props: LoginWithGithubProps) {
  const { page, baseURL, user = 'octocat' } = props;
  const githubLoginUrl = new URL(page.url());
  const returnToUrl = new URL(
    githubLoginUrl.searchParams.get('return_to') ?? '',
    githubLoginUrl.origin,
  );

  const url = new URL('/auth/callback/github', baseURL);
  const state = returnToUrl.searchParams.get('state') ?? '';
  const code = GitHubData.USERS[user].auth.code;
  url.searchParams.set('code', code);
  url.searchParams.set('state', state);

  await page.goto(url.href);
  await page.waitForLoadState('networkidle');
}
