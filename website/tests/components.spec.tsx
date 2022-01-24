/**
 * @vitest-environment happy-dom
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Header } from '../app/components/header';

describe('Header', () => {
  it('can render', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    expect(getByText('Home')).toBeTruthy();
  });
});
