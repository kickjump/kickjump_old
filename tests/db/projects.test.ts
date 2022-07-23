import { ProjectModel, UserModel } from '@kickjump/db';
import { describe, expect, it } from 'vitest';

const projects: Set<string> = new Set();
const users: Set<string> = new Set();

describe('create', () => {
  it('essential project', async () => {
    const user = await UserModel.create({ name: 'Tolani', username: 'tolani' });
    users.add(user.id);
    const project = await ProjectModel.createEssential({
      creator: user.id,
      slug: 'my-project',
      title: 'My project',
    });
    projects.add(project.id);

    expect(project.members).toHaveLength(1);
    expect(project.members.at(0)?.actor?.id).toBe(project.creator.id);
    expect(project.members.at(0)?.permissions).toEqual(['owner']);
  });
});

describe('update', async () => {
  const user = await UserModel.create({ name: 'Ms Updater', username: 'ms_updater' });
  users.add(user.id);

  const project = await ProjectModel.createEssential({
    creator: user.id,
    slug: 'another-project',
    title: 'Another Project',
  });
  projects.add(project.id);

  it('can update the description', async () => {
    const description = 'This is a new description to use.';
    const updated = await ProjectModel.update({ id: project.id, description });

    expect(updated?.description).toBe(description);
    const retrieved = await ProjectModel.find(project.id);

    expect(retrieved?.description).toBe(description);
  });
});
