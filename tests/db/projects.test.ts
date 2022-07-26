import { MembershipModel, ProjectModel, UserModel } from '@kickjump/db';
import { describe, expect, it } from 'vitest';

const projects: Set<string> = new Set();
const users: Set<string> = new Set();

describe('create', () => {
  it('essential project', async () => {
    const userId = await UserModel.create({ name: 'Tolani', username: 'tolani' });
    users.add(userId);
    const projectId = await ProjectModel.createEssential({
      creator: userId,
      name: 'my-project',
      description: '# My Project\n\nHello friend!',
    });
    projects.add(projectId);

    const [project, membership] = await Promise.all([
      ProjectModel.findById(projectId),
      MembershipModel.findOne({ actor: userId, entity: projectId }),
    ]);

    expect(project?.members).toHaveLength(1);
    expect(membership?.permissions).toEqual(['owner']);
  });
});

describe('update', async () => {
  const userId = await UserModel.create({ name: 'Terminator', username: 'Terminator' });

  const projectId = await ProjectModel.createEssential({
    creator: userId,
    name: 'another-project',
    description: 'Another Project',
  });
  projects.add(projectId);

  it('can update the description', async () => {
    const description = 'This is a new description to use.';
    await ProjectModel.update({ id: projectId, description });

    const updated = await ProjectModel.findById(projectId);
    expect(updated?.description).toBe(description);
  });
});
