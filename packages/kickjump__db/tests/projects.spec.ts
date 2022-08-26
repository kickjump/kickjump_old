import { expect, test } from 'vitest';

import { MembershipModel, ProjectModel, UserModel } from '../';

test('create', async () => {
  const userId = await UserModel.create({ name: 'Tolani', username: 'tolani' });
  const projectId = await ProjectModel.createEssential({
    creator: userId,
    name: 'my-project',
    description: '# My Project\n\nHello friend!',
  });

  const [project, membership] = await Promise.all([
    ProjectModel.findById(projectId),
    MembershipModel.findOne({ actor: userId, entity: projectId }),
  ]);

  expect(project?.members).toHaveLength(1);
  expect(membership?.permissions).toEqual(['owner']);
});

test('can update the description', async () => {
  const userId = await UserModel.create({ name: 'Terminator', username: 'Terminator' });

  const projectId = await ProjectModel.createEssential({
    creator: userId,
    name: 'another-project',
    description: 'Another Project',
  });

  const description = 'This is a new description to use.';
  await ProjectModel.update({ id: projectId, description });

  const updated = await ProjectModel.findById(projectId);
  expect(updated?.description).toBe(description);
});
