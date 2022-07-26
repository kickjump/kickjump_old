import type { Action as RawAction } from '@kickjump/edgedb/types';

import type { TypeFromFields } from '../db.js';
import { type AvailableOptions, type Custom, type DeepOmit, createTypeSafeFields } from '../db.js';

export type ActionType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawAction, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<ActionType>();
export const FIELDS = createFields({
  action: true,
  actor: true,
  createdAt: true,
  data: true,
  id: true,
  target: true,
});
export type Action = TypeFromFields<ActionType, typeof FIELDS>;
