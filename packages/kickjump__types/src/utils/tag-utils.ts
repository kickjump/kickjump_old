import type { Tag as RawTag } from '@kickjump/edgedb/types';
import { z } from 'zod';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type Type<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawTag, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<Type>();
export const FIELDS = createFields({ createdAt: true, id: true, name: true });
export type Tag = TypeFromFields<Type, typeof FIELDS>;

export function name() {
  return z.string().max(20).min(2);
}

export function createSchema() {
  return z.object({
    entity: z.string().uuid(),
    name: name(),
  });
}
