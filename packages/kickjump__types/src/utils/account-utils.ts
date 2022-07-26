import type { Account as RawAccount } from '@kickjump/edgedb/types';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type Type<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawAccount, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<Type>();
export const FIELDS = createFields({
  provider: true,
  login: true,
  id: true,
  providerAccountId: true,
  createdAt: true,
  updatedAt: true,
  scope: true,
  user: true,
});
export const PRIVATE_FIELDS = createFields({ ...FIELDS, accessToken: true, refreshToken: true });
export type Account = TypeFromFields<Type, typeof FIELDS>;
export type PrivateAccount = TypeFromFields<Type, typeof PRIVATE_FIELDS>;
