import { MembershipModel, ProjectModel } from '@kickjump/db';
import { ProjectUtils, Visibility } from '@kickjump/types';
import { transformer } from '@kickjump/types';
import { error } from '@sveltejs/kit';

import type { PageServerLoadEvent } from './$types.js';
import { MESSAGE } from './messages.js';

export async function load(event: PageServerLoadEvent) {
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

  return transformer.serialize(project);
}
