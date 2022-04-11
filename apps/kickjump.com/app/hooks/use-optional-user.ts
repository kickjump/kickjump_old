import { type User } from '~/utils/db.server';

import { useMatchesData } from './use-matches-data';

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string';
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');

  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user;
}
