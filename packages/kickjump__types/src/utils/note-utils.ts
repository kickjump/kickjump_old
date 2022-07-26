import type { Note as RawNote } from '@kickjump/edgedb/types';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  createTypeSafeFields,
} from '../db.js';

export type NoteType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawNote, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<NoteType>();
export const FIELDS = createFields({
  createdAt: true,
  creator: true,
  id: true,
  message: true,
  reactions: true,
  tags: true,
  updatedAt: true,
});
export type Note = TypeFromFields<NoteType, typeof FIELDS>;
