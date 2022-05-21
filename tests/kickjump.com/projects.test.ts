import { expect, test } from '@kickjump/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/projects');
});

test('the project page can be loaded', async ({ page }) => {
  const title = await page.title();
  expect(title).toBe('Projects | KickJump');
});

test('the project page shows a list of projects', async ({ queries }) => {
  await queries.getByLabelText('Projects List');
});
