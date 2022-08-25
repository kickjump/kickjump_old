import { MembershipModel, ProjectModel } from '@kickjump/db';
import { ProjectUtils, replaceJsonDate, Visibility } from '@kickjump/types';
import { type ServerLoadEvent, error } from '@sveltejs/kit';

import type { RouteParams } from './$types';

export async function load(event: ServerLoadEvent<RouteParams>) {
  const { name } = event.params;
  const project = await ProjectModel.findByName(name);

  if (!project) {
    throw error(404, 'Project not found');
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

  return { project: replaceJsonDate(project) };
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
