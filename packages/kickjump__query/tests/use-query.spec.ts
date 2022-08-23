/**
 * @vitest-environment happy-dom
 */

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, test } from 'vitest';

import { QueryCache } from '../src/index.js';
import Example from './components/Example.svelte';
import SetDefaultDataValue from './components/SetDefaultDataValue.svelte';
import Wrapper from './components/Wrapper.svelte';
import { createQueryClient, setupJestDomMatchers } from './utils.js';

setupJestDomMatchers();

test('can mount a component', () => {
  const screen = render(Example);
  screen.getByText('Hello');
});

test('should allow to set default data value', async () => {
  const cache = new QueryCache();
  const client = createQueryClient({ queryCache: cache });
  const screen = render(Wrapper, { props: { client, Component: SetDefaultDataValue } });

  screen.getByText('default');

  await screen.findByText('test');
});

afterEach(cleanup);
