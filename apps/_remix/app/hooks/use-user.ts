import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type PopulatedUser } from '~/utils/db.server';

export const UserContext = createContext<PopulatedUser | undefined>(undefined);

/**
 * Return the user if it exists in the context.
 */
export function useOptionalUser(): PopulatedUser | undefined {
  return useContext(UserContext);
}

/**
 * Get the user, and throw an error if the user is logged in.
 */
export function useUser(): PopulatedUser {
  const user = useOptionalUser();
  invariant(user, 'No user was found in the `root` loader.');

  return user;
}

/**
 * Return true when the user is logged in.
 */
export function useIsAuthenticated(): boolean {
  return !!useOptionalUser();
}
