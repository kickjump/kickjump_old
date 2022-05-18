import { expect, test } from '@kickjump/playwright';

test('the site shows a list of top projects', async ({ page }) => {
  await page.goto('/projects');
});
