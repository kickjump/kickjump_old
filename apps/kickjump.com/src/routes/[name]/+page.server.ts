import { MembershipModel, ProjectModel } from '@kickjump/db';
import { ProjectUtils, Visibility } from '@kickjump/types';
import { type ServerLoadEvent, error } from '@sveltejs/kit';
import { objectEntries } from 'ts-extras';

import type { RouteParams } from './$types';

export async function load(event: ServerLoadEvent<RouteParams>) {
  const { name } = event.params;
  const project = await ProjectModel.findByName(name);

  if (!project) {
    throw error(404, `No project exists for ${name}`);
  }

  const permissions: string[] = [Visibility.$public];
  // is the project readable by current user.
  const user = event.locals.session.get('user');

  if (user) {
    const membership = await MembershipModel.findOne({ actor: user.id, entity: project.id });
    permissions.push(...(membership?.permissions ?? []));
  }

  const value = ProjectUtils.readPermissions(project, permissions);

  if (!value) {
    throw error(403, MESSAGE[project.visibility]);
  }

  const serializable = Object.create(null);

  for (const [key, value] of objectEntries(project)) {
    if (value instanceof Date) {
      serializable[key] = value.toISOString();
      continue;
    }

    serializable[key] = value;
  }

  // console.log(project);

  // return { project: { name: 'world', visibility: 'admin', description: 'This is a description' } };
  return { project: serializable as typeof project };
}

const MESSAGE: Record<Visibility, string> = {
  admin: 'Only admin members can read this project',
  editor: 'Only editors can read this project',
  manager: 'Only managers can read this project',
  member:
    'Only members, managers, editors, administrators and the owner can view this project right now.',
  owner: 'Only the owner can view this project at the moment.',
  public: 'Open to all.',
};
