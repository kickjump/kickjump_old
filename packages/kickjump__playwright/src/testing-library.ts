import type { PlaywrightTestArgs, TestFixture } from '@playwright/test';
import {
  getDocument,
  queries as unscopedQueries,
  within as unscopedWithin,
} from 'playwright-testing-library';
import type {
  ElementHandle,
  FixtureQueries as Queries,
} from 'playwright-testing-library/dist/typedefs';

interface TestingLibraryFixtures {
  queries: Queries;
  $document: ElementHandle;
  within: typeof unscopedWithin;
}

const queryNames: Array<keyof Queries> = [
  'queryByPlaceholderText',
  'queryAllByPlaceholderText',
  'getByPlaceholderText',
  'getAllByPlaceholderText',
  'findByPlaceholderText',
  'findAllByPlaceholderText',

  'queryByText',
  'queryAllByText',
  'getByText',
  'getAllByText',
  'findByText',
  'findAllByText',

  'queryByLabelText',
  'queryAllByLabelText',
  'getByLabelText',
  'getAllByLabelText',
  'findByLabelText',
  'findAllByLabelText',

  'queryByAltText',
  'queryAllByAltText',
  'getByAltText',
  'getAllByAltText',
  'findByAltText',
  'findAllByAltText',

  'queryByTestId',
  'queryAllByTestId',
  'getByTestId',
  'getAllByTestId',
  'findByTestId',
  'findAllByTestId',

  'queryByTitle',
  'queryAllByTitle',
  'getByTitle',
  'getAllByTitle',
  'findByTitle',
  'findAllByTitle',

  'queryByRole',
  'queryAllByRole',
  'getByRole',
  'getAllByRole',
  'findByRole',
  'findAllByRole',

  'queryByDisplayValue',
  'queryAllByDisplayValue',
  'getByDisplayValue',
  'getAllByDisplayValue',
  'findByDisplayValue',
  'findAllByDisplayValue',
];

const queries: TestFixture<Queries, PlaywrightTestArgs> = async ({ page }, use) => {
  const queries = {} as Queries;

  for (const name of queryNames) {
    // @ts-expect-error lazy me
    queries[name] = async (...args) => {
      const document = await getDocument(page);

      // @ts-expect-error lazy me
      return unscopedQueries[name](document, ...args);
    };
  }

  queries.getNodeText = async (e) => unscopedQueries.getNodeText(e);

  await use(queries);
};

const $document: TestFixture<ElementHandle, PlaywrightTestArgs> = ({ page }, use) =>
  getDocument(page).then((element) => use(element));
const within: TestFixture<typeof unscopedWithin, PlaywrightTestArgs> = ({ page: _ }, use) =>
  use(unscopedWithin);

const fixtures = { queries, $document, within };

export { configure } from 'playwright-testing-library';
export { fixtures };
export type { TestingLibraryFixtures };

export { type FixtureQueries as Queries } from 'playwright-testing-library/dist/typedefs';
