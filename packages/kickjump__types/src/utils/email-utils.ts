import type { Email as RawEmail } from '@kickjump/edgedb/types';

import type { TypeFromFields } from '../db.js';
import { type AvailableOptions, type Custom, type DeepOmit, createTypeSafeFields } from '../db.js';

export type Type<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawEmail, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<Type>();
export const FIELDS = createFields({
  createdAt: true,
  email: true,
  id: true,
  primary: true,
  updatedAt: true,
  user: true,
  verified: true,
});
export type Email = TypeFromFields<Type, typeof FIELDS>;
