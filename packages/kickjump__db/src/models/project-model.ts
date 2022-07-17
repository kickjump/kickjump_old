import type { Status, Visibility } from '../edgedb.js';
import { type OmittedKeys, type ProjectType, e, run } from '../edgedb.js';

const PROJECT_SELECTOR = {
  ...e.Project['*'],
  creator: { name: true, id: true },
  members: { '@permissions': true, id: true },
  proposals: true,
};

/**
 * Create a draft project.
 */
export async function create(props: ProjectCreateInput) {
  const creator = e.select(e.User, (user) => ({
    filter: e.op(user.id, '=', e.uuid(props.creator)),
  }));

  const insert = e.insert(e.Project, {
    slug: props.slug,
    description: props.description,
    title: props.title,
    privacy: props.privacy,
    status: props.status,
    creator,
    members: e.select(creator, () => ({
      '@permissions': e.array([e.cast(e.Permission, 'owner')]),
    })),
  });

  const select = e.select(insert, (project) => ({
    ...PROJECT_SELECTOR,
    filter: e.op(project.id, '=', insert.id),
  }));

  const project = await run(select);

  if (!project) {
    throw new Error('The project could not be created');
  }

  return project;
}

/**
 * Quickly create a project. The creator should be a valid user id and is automatically
 */
export function createEssential(props: ProjectCreateBaseInput) {
  const { creator, slug, title } = props;

  return create({
    creator,
    title,
    slug,
    description: '',
    privacy: 'creator',
    status: 'draft',
  });
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

  const project = await run(query);

  return project ?? undefined;
}

export type Project = Awaited<ReturnType<typeof create>>;
export type ProjectCreateInput = ProjectType<{
  omit: OmittedKeys;
  simplify: true;
  replace: { creator: string; privacy: keyof typeof Visibility; status: keyof typeof Status };
}>;
export type ProjectCreateBaseInput = Pick<ProjectCreateInput, 'creator' | 'slug' | 'title'>;
