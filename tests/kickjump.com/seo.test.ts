import { expect, test } from '@kickjump/playwright';

const titles = {
  '/': 'KickJump',
  '/about': 'About | KickJump',
  '/project': 'Projects | KickJump',
};

test('the site displays the correct metadata', async ({ page }) => {
  for (const [path, title] of Object.entries(titles)) {
    await page.goto(path);
    await expect(page.title()).resolves.toBe(title);
  }
});
