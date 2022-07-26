import {
  type CreateOmitKeys,
  type EnumUnion,
  type UpdateOmitKeys,
  ProjectUtils,
  Status,
  Visibility,
} from '@kickjump/types';

import { e, run } from '../edgedb.js';

/**
 * Create a project and return the id of the created project.
 */
export async function create(props: ProjectCreateInput): Promise<string> {
  const creator = e.select(e.User, (user) => ({
    filter: e.op(user.id, '=', e.uuid(props.creator)),
  }));

  const entity = e.insert(e.Project, {
    name: props.name,
    description: props.description,
    visibility: props.visibility,
    status: props.status,
    creator,
  });

  const membership = e.insert(e.Membership, {
    entity,
    actor: creator,
    permissions: e.array([Visibility.owner]),
  });

  const query = e.set(entity, membership);
  const [project] = await run(query);

  if (!project.id) {
    throw new Error('The project could not be created');
  }

  return project.id;
}

/**
 * Quickly create a project. The creator should be a valid user id and is automatically
 */
export function createEssential(props: ProjectCreateBaseInput): Promise<string> {
  const { creator, name, description } = props;

  return create({
    creator,
    name,
    description,
    visibility: Visibility.owner,
    status: Status.draft,
  });
}

/**
 * Update the user
 */
export async function update(props: ProjectUpdateInput): Promise<void> {
  const query = e.update(e.Project, (project) => {
    return {
      filter: e.op(project.id, '=', e.uuid(props.id)),
      set: {
        updatedAt: e.datetime_current(),
        description: props.description ?? project.description,
        visibility: props.visibility ?? project.visibility,
        status: props.status ?? project.status,
        name: props.name ?? project.name,
      },
    };
  });

  await run(query);
}

export async function remove(id: string) {
  await removeAll([id]);
}

export async function removeAll(ids: string[]): Promise<void> {
  const query = e.delete(e.Project, (project) => ({
    filter: e.op(project.id, 'in', e.set(...ids.map((id) => e.uuid(id)))),
  }));

  await run(query);
}

export async function findByName(name: string): Promise<ProjectUtils.Project | undefined> {
  const query = e.select(e.Project, (project) => ({
    ...ProjectUtils.FIELDS,
    filter: e.op(project.name, '=', e.str(name)),
  }));

  const project = await run(query);

  return project ?? undefined;
}

export async function findById(id: string): Promise<ProjectUtils.Project | undefined> {
  const query = e.select(e.Project, (project) => ({
    ...ProjectUtils.FIELDS,
    filter: e.op(project.id, '=', e.uuid(id)),
  }));

  return (await run(query)) ?? undefined;
}

interface HasPermissionProps {
  actions: readonly ProjectUtils.Action[];
  actor: string;
  project: string;
}

/**
 * Does the actor have permissions to perform the requested actions.
 */
export async function hasPermission(props: HasPermissionProps): Promise<boolean> {
  if (props.actions.length === 0) {
    return false;
  }

  const query = e
    .select(e.Membership, (membership) => ({
      entity: e.is(e.Project, { visibility: true }),
      permissions: true,
      filter: e.op(
        e.op(membership.actor.id, '=', e.uuid(props.actor)),
        'and',
        e.op(membership.entity.id, '=', e.uuid(props.project)),
      ),
    }))
    .assert_single();

  const result = await run(query);

  if (!result) {
    return false;
  }

  const visibility = result.entity.visibility ?? Visibility.owner;
  const permissions = result.permissions;

  for (const action of props.actions) {
    if (!ProjectUtils.has({ action, permissions, visibility })) {
      return false;
    }
  }

  return true;
}

export type ProjectCreateInput = ProjectUtils.Type<{
  omit: CreateOmitKeys;
  simplify: true;
  replace: { creator: string };
}>;
export type ProjectUpdateInput = ProjectUtils.Type<{
  omit: UpdateOmitKeys | 'creator';
  simplify: true;
  partial: true;
  replace: {
    id: string;
    privacy?: EnumUnion<Visibility>;
    status?: EnumUnion<Status>;
  };
}>;
export type ProjectCreateBaseInput = Pick<ProjectCreateInput, 'creator' | 'name' | 'description'>;
