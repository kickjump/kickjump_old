import { Permission } from '@kickjump/types';
import invariant from 'tiny-invariant';

import {
  type CreateOmitKeys,
  type ProjectType,
  type UpdateOmitKeys,
  e,
  run,
  Status,
  Visibility,
} from '../edgedb.js';

const PROJECT_SELECTOR = {
  ...e.Project['*'],
  creator: { name: true, id: true },
  members: {
    permissions: true,
    actor: true,
  },
  proposals: true,
};

/**
 * Create a draft project.
 */
export async function create(props: ProjectCreateInput) {
  const creator = e.select(e.User, (user) => ({
    filter: e.op(user.id, '=', e.uuid(props.creator)),
  }));

  const entity = e.insert(e.Project, {
    slug: props.slug,
    description: props.description,
    title: props.title,
    visibility: props.visibility,
    status: props.status,
    creator,
  });

  const membership = e.insert(e.Membership, {
    entity,
    actor: creator,
    permissions: e.array([Permission.Owner]),
  });

  const select = e.select(membership, () => ({
    ...e.Membership['*'],
    entity: true,
  }));

  const value = await run(select);
  const projectId = value?.entity?.id;

  if (!projectId) {
    throw new Error('The project could not be created');
  }

  const project = await run(
    e.select(e.Project, (project) => ({
      ...PROJECT_SELECTOR,
      filter: e.op(project.id, '=', e.uuid(projectId)),
    })),
  );

  invariant(project, 'The project could not be populated.');
  return project;
}

/**
 * Quickly create a project. The creator should be a valid user id and is automatically
 */
export function createEssential(props: ProjectCreateBaseInput): Promise<Project> {
  const { creator, slug, title } = props;

  return create({
    creator,
    title,
    slug,
    description: '',
    visibility: Visibility.creator,
    status: Status.draft,
  });
}

/**
 * Update the user
 */
export async function update(props: ProjectUpdateInput): Promise<Project | undefined> {
  const updateQuery = e.update(e.Project, (project) => {
    return {
      filter: e.op(project.id, '=', e.uuid(props.id)),
      set: {
        updatedAt: e.datetime_current(),
        title: props.title ?? project.title,
        description: props.description ?? project.description,
        visibility: props.visibility ?? project.visibility,
        status: props.status ?? project.status,
        slug: props.slug ?? project.slug,
      },
    };
  });

  const query = e.select(updateQuery, () => PROJECT_SELECTOR);
  return (await run(query)) ?? undefined;
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

export async function findBySlug(slug: string): Promise<Project | undefined> {
  const query = e.select(e.Project, (project) => ({
    ...PROJECT_SELECTOR,
    filter: e.op(project.slug, '=', e.str(slug)),
  }));

  return (await run(query)) ?? undefined;
}

export async function find(id: string): Promise<Project | undefined> {
  const query = e.select(e.Project, (project) => ({
    ...PROJECT_SELECTOR,
    filter: e.op(project.id, '=', e.uuid(id)),
  }));

  return (await run(query)) ?? undefined;
}

export type Project = Awaited<ReturnType<typeof create>>;
export type ProjectCreateInput = ProjectType<{
  omit: CreateOmitKeys;
  simplify: true;
  replace: { creator: string };
}>;
export type ProjectUpdateInput = ProjectType<{
  omit: UpdateOmitKeys | 'creator';
  simplify: true;
  partial: true;
  replace: {
    id: string;
    privacy?: keyof typeof Visibility;
    status?: keyof typeof Status;
    // members?: Array<{actor: string, permissions: string[]} | string>;
  };
}>;
export type ProjectCreateBaseInput = Pick<ProjectCreateInput, 'creator' | 'slug' | 'title'>;
