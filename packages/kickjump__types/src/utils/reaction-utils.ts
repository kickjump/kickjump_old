import type { Reaction as RawReaction } from '@kickjump/edgedb/types';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type ReactionType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawReaction, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<ReactionType>();
export const FIELDS = createFields({
  actor: true,
  createdAt: true,
  id: true,
  name: true,
  target: true,
});
export type Reaction = TypeFromFields<ReactionType, typeof FIELDS>;
