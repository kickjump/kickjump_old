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
