import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

import { type User } from '~/utils/db.server';

export const UserContext = createContext<User | undefined>(undefined);

/**
 * Return the user if it exists in the context.
 */
export function useOptionalUser() {
  return useContext(UserContext);
}

/**
 * Get the user, and throw an error if the user is logged in.
 */
export function useUser() {
  const user = useOptionalUser();
  invariant(user, 'No user was found in the `root` loader.');

  return user;
}
