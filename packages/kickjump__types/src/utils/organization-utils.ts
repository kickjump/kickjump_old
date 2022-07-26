import type { Organization as RawOrganization } from '@kickjump/edgedb/types';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type OrganizationType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawOrganization, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<OrganizationType>();
export const FIELDS = createFields({ id: true, memberships: true });
export type Organization = TypeFromFields<OrganizationType, typeof FIELDS>;
