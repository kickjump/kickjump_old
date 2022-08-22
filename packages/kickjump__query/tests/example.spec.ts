/**
 * @vitest-environment happy-dom
 */

import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import Example from './example.svelte';

test('can mount a component', () => {
  const { getByText } = render(Example);
  expect(() => getByText('Hello')).not.toThrow();
});
