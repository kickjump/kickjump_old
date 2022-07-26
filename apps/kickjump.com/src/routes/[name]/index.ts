import { MembershipModel, ProjectModel } from '@kickjump/db';
import { ProjectUtils, Visibility } from '@kickjump/types';
import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';

const NOT_FOUND = { status: 404 } as const;

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
  const { name } = event.params;
  console.log({ name });

  if (!name) {
    return NOT_FOUND;
  }

  const project = await ProjectModel.findByName(name);

  if (!project) {
    return {
      status: 404,
    };
  }

  const permissions: string[] = [Visibility.$public];
  // is the project readable by current user.
  const user = event.locals.session.get('user');

  if (user) {
    const membership = await MembershipModel.findOne({ actor: user.id, entity: project.id });
    permissions.push(...(membership?.permissions ?? []));
  }

  const value = ProjectUtils.read(project, permissions);

  if (!value) {
    return { status: 403, body: { error: true, message: MESSAGE[project.visibility] } };
  }

  return { status: 200, body: { project: project as any } };
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
