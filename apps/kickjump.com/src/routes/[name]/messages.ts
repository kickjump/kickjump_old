import type { Visibility } from '@kickjump/types';

export const MESSAGE: Record<Visibility, string> = {
  admin: 'Only admin members can read this project',
  editor: 'Only editors can read this project',
  manager: 'Only managers can read this project',
  member:
    'Only members, managers, editors, administrators and the owner can view this project right now.',
  owner: 'Only the owner can view this project at the moment.',
  public: 'Open to all.',
};
