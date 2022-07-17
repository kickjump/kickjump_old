import { ProjectModel, UserModel } from '@kickjump/db';
import { afterAll, describe, expect, it } from 'vitest';

const projects: Set<string> = new Set();
const users: Set<string> = new Set();

afterAll(async () => {
  await ProjectModel.removeAll([...projects]);
  await UserModel.removeAll([...users]);
});

describe('create', () => {
  it('essential project', async () => {
    const user = await UserModel.create({ name: 'Tolani' });
    users.add(user.id);
    const project = await ProjectModel.createEssential({
      creator: user.id,
      slug: 'my-project',
      title: 'My project',
    });
    projects.add(project.id);

    expect(project.members).toHaveLength(1);
    expect(project.members.at(0)?.id).toBe(project.creator.id);
  });
});
