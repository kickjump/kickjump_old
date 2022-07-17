import {
  type OmittedKeys,
  type ProjectType,
  e,
  Permission,
  Privacy,
  run,
  Status,
} from '../edgedb.js';

const PROJECT_SELECTOR = {
  ...e.Project['*'],
  members: {
    '@permissions': true,
    id: true,
  },
  proposals: true,
};

/**
 * Create a draft project.
 */
export function create(props: ProjectCreateInput) {
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
    members: e.select(e.User, (user) => ({
      '@permissions': e.cast(e.Permission, Permission.owner),
      filter: e.op(user.id, '=', creator.id),
    })),
  });

  const select = e.select(e.Project, (project) => ({
    ...PROJECT_SELECTOR,
    filter: e.op(project.id, '=', insert.id),
  }));

  return run(select);
}

/**
 * Quickly create a project. The creator should be a valid user id and is automatically
 */
export async function createEssential(props: ProjectCreateBaseInput) {
  const { creator, slug, title } = props;

  return create({
    creator,
    title,
    slug,
    description: '',
    privacy: Privacy.$private,
    status: Status.draft,
  });
}

export type Project = ReturnType<typeof create>;

export type ProjectCreateInput = ProjectType<{
  omit: OmittedKeys;
  simplify: true;
  replace: { creator: string };
}>;
export type ProjectCreateBaseInput = Pick<ProjectCreateInput, 'creator' | 'slug' | 'title'>;
