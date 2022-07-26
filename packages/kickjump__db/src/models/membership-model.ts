import { MembershipUtils } from '@kickjump/types';

import { e, run } from '../edgedb.js';

export const Entity = {
  default: e.HasMembership,
  project: e.Project,
  organization: e.Organization,
  proposal: e.Proposal,
} as const;
export type Entity = typeof Entity;

interface FindProps {
  actor: string;
  entity: string;
}
export async function findOne(props: FindProps): Promise<MembershipUtils.Membership | undefined> {
  const { actor, entity } = props;

  const query = e
    .select(e.Membership, (membership) => ({
      ...MembershipUtils.FIELDS,
      filter: e.op(
        e.op(membership.actor.id, '=', e.uuid(actor)),
        'and',
        e.op(membership.entity.id, '=', e.uuid(entity)),
      ),
    }))
    .assert_single();

  const result = await run(query);

  return result ?? undefined;
}
