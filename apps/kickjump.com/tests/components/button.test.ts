import { expect, test } from '@playwright/experimental-ct-svelte';

import { Button } from '$components/buttons';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  // const changes: Array<{ count: number }> = [];

  const component = await mount(Button, {
    // slots: { default: [Text] },
    // props: {
    //   $$slots: { default: Text },
    //   $$scope: { ctx: {} },
    // },
  });
  await expect(component.innerHTML()).resolves.toBe(
    '<button class="btn gap-x-3 btn-md">  </button>',
  );

  // const increment = component.locator('button[aria-label*=Increase]');
  // const decrement = component.locator('button[aria-label*=Decrease]');
  // await expect(component).toContainText('0s');

  // await increment.click();
  // await expect(component).toContainText('1s');
  // expect(changes).toEqual([{ count: 1 }]);

  // await increment.click();
  // await expect(component).toContainText('2s');
  // expect(changes).toEqual([{ count: 1 }, { count: 2 }]);

  // await decrement.click();
  // await expect(component).toContainText('1s');
  // expect(changes).toEqual([{ count: 1 }, { count: 2 }, { count: 1 }]);
});
