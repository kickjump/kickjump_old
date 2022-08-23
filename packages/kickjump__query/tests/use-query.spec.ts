/**
 * @vitest-environment happy-dom
 */

import { cleanup, render, waitFor } from '@testing-library/svelte';
import { afterEach, expect, test } from 'vitest';

import { QueryCache } from '../src/index.js';
import Example from './components/Example.svelte';
import SetDefaultDataValue from './components/SetDefaultDataValue.svelte';
import Wrapper from './components/Wrapper.svelte';
import { createQueryClient, setupJestDomMatchers } from './utils.js';

setupJestDomMatchers();

test('can mount a component', () => {
  const { getByText } = render(Example);
  expect(() => getByText('Hello')).not.toThrow();
});

test('should allow to set default data value', async () => {
  const cache = new QueryCache();
  const client = createQueryClient({ queryCache: cache });
  const rendered = render(Wrapper, { props: { client, Component: SetDefaultDataValue } });

  rendered.getByText('default');

  await waitFor(() => rendered.getByText('test'));
});

afterEach(cleanup);
