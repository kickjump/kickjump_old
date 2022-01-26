/**
 * @vitest-environment happy-dom
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Header } from '../src/components/header';

describe('Header', () => {
  it('can render', () => {
    const { getByText } = render(<Header />);

    expect(getByText('Home')).toBeTruthy();
  });
});
