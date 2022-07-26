import type { Membership as RawMembership } from '@kickjump/edgedb/types';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type MembershipType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawMembership, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<MembershipType>();
export const FIELDS = createFields({
  actor: true,
  createdAt: true,
  entity: true,
  id: true,
  permissions: true,
  updatedAt: true,
});
export type Membership = TypeFromFields<MembershipType, typeof FIELDS>;
