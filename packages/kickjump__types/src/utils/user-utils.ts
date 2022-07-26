import type { User as RawUser } from '@kickjump/edgedb/types';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type Type<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawUser, '__type__'>,
  Options
>;

/**
 * Create fields that can be used to extract data from the User Schema.
 */
export const createFields = createTypeSafeFields<Type>();

export const FIELDS = createTypeSafeFields<Type>()({
  id: true,
  accounts: {
    id: true,
    provider: true,
    providerAccountId: true,
  },
  createdAt: true,
  emails: {
    id: true,
    email: true,
    verified: true,
    primary: true,
  },
  image: true,
  name: true,
  updatedAt: true,
  username: true,
});

export type User = TypeFromFields<Type, typeof FIELDS>;
