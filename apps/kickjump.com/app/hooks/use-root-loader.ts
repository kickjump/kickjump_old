import type { PopulatedUser } from '~/utils/db.server';

import { useMatchesData } from './use-matches-data';

export interface RootLoaderData {
  user: PopulatedUser | undefined;
  csrf: string;
}

function isRootLoaderData(data: unknown): data is RootLoaderData {
  console.log('check', typeof data);
  return typeof data === 'object';
}

export function useRootLoader(): RootLoaderData {
  const data = useMatchesData('root');

  if (!data || !isRootLoaderData(data)) {
    return { user: undefined, csrf: '' };
  }

  return data;
}
