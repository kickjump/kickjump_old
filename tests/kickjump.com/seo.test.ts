import { expect, test } from '@kickjump/playwright';

const titles = {
  '/': 'KickJump',
  '/projects': 'Projects | KickJump',
  '/about': 'About | KickJump',
};

for (const [path, title] of Object.entries(titles)) {
  test(`the site displays the correct metadata for '${path}'`, async ({ page }) => {
    await page.goto(path);
    await expect(page.title()).resolves.toBe(title);
  });
}

const externalLinks = {
  GitHub: 'https://github.com/kickjump/kickjump',
  Discord: 'https://discord.com/invite/mzaFsAUn22',
  Twitter: 'https://twitter.com/kickjumpco',
}

for (const [label, redirect] of Object.entries(externalLinks)) {
  test(`the site redirects when clicking the ${label} footer link`, async ({context, page}) => {
    await page.goto('/');
    const link = page.locator(`[aria-label="${label}"]`)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      link.click(),
    ]);

    await page.waitForLoadState();
    expect(newPage.url()).toBe(redirect);
  })
}
