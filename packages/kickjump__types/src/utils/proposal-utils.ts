import type { Proposal as RawProposal } from '@kickjump/edgedb/types';

import type { AvailableOptions, Custom, DeepOmit, TypeFromFields } from '../db.js';
import { createTypeSafeFields } from '../db.js';

export type ProposalType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawProposal, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<ProposalType>();
export const FIELDS = createFields({
  createdAt: true,
  id: true,
  project: true,
  status: true,
  updatedAt: true,
  visibility: true,
});
export type Proposal = TypeFromFields<ProposalType, typeof FIELDS>;
