import { expect, test } from 'vitest';

import { ProjectUtils } from '../';

test('has', () => {
  expect(
    ProjectUtils.has({ action: 'read', permissions: ['public', 'owner'], visibility: 'owner' }),
  ).toBe(true);
  expect(ProjectUtils.has({ action: 'read', visibility: 'public' })).toBe(true);
});
