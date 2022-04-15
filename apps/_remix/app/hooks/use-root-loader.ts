import type { PopulatedUser } from '~/utils/db.server';

import { useMatchesData } from './use-matches-data';

export interface RootLoaderData {
  user: PopulatedUser | undefined;
  csrf: string;
}

function isRootLoaderData(data: unknown): data is RootLoaderData {
  return typeof data === 'object';
}

/**
 * Get the data from the root loader.
 */
export function useRootLoader(): RootLoaderData {
  const data = useMatchesData('root');

  if (!data || !isRootLoaderData(data)) {
    return { user: undefined, csrf: '' };
  }

  return data;
}
