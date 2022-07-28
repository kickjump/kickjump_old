import { e, run, Visibility } from '@kickjump/db';
import { describe, expect, it } from 'vitest';

import { router } from '../src/index.js';
import { createContext } from './helpers.js';

describe('create', () => {
  it('requires authentication', async () => {
    const caller = router.createCaller(createContext());
    await expect(
      caller.project.create({ name: 'simple', description }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '"This procedure requires authentication to access"',
    );
  });

  it('can create a project', async () => {
    const { caller } = await setupAuthenticatedRouterCaller();
    const name = 'simple';

    const result = await caller.project.create({ name, description });

    const project = await getTestableProject(name);

    expect(result).toBeTypeOf('string');
    expect(project).toMatchSnapshot();
  });

  it('can create a project with tags', async () => {
    const { caller } = await setupAuthenticatedRouterCaller();
    const name = 'simple';
    await caller.project.create({ name, description, tags: ['welcome', 'to', 'the', 'jungle'] });

    const project = await getTestableProject(name);
    expect(project).toMatchSnapshot();
  });
});

describe('update', () => {
  it('can update the description', async () => {
    const { caller } = await setupAuthenticatedRouterCaller();
    const name = 'simple';
    const id = await caller.project.create({ name, description });

    await caller.project.update({
      id,
      description: 'What about another description with enough characters?',
    });

    await expect(getTestableProject(name)).resolves.toMatchSnapshot();
  });

  it('can update tags', async () => {
    const { caller } = await setupAuthenticatedRouterCaller();
    const name = 'simple';
    const id = await caller.project.create({ name, description, tags: ['xyz'] });

    await caller.project.update({
      id,
      tags: { add: ['abc', 'def', 'ghi', 'jkl'], remove: ['xyz'] },
    });

    await expect(getTestableProject(name)).resolves.toMatchSnapshot();

    await caller.project.update({ id, tags: { removeAll: true } });
    const result = await getTestableProject(name);
    expect(result?.tags).toHaveLength(0);
  });

  describe('permissions', () => {
    it('only lets users with required permissions update', async () => {
      const name = 'simple';
      const newDescription = 'An alternative title to test with.';
      const [nonMember, member, admin] = await run(
        e.set(
          e.insert(e.User, { username: 'john' }),
          e.insert(e.User, { username: 'wendy' }),
          e.insert(e.User, { username: 'sally' }),
        ),
      );
      const { caller } = await setupAuthenticatedRouterCaller();
      const id = await caller.project.create({ name, description });
      const noMembership = router.createCaller(createContext({ user: { id: nonMember.id } }));
      await expect(
        noMembership.project.update({
          id,
          description: newDescription,
          visibility: Visibility.$public,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();

      const memberQuery = e.insert(e.Membership, {
        actor: e.select(e.User, (user) => ({ filter: e.op(user.id, '=', e.uuid(member.id)) })),
        entity: e.select(e.Project, (project) => ({ filter: e.op(project.id, '=', e.uuid(id)) })),
        permissions: [Visibility.member],
      });

      await run(memberQuery);

      const memberCaller = router.createCaller(createContext({ user: { id: member.id } }));
      await expect(
        memberCaller.project.update({
          id,
          description: newDescription,
          visibility: Visibility.$public,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();

      const admin3Query = e.insert(e.Membership, {
        actor: e.select(e.User, (user) => ({ filter: e.op(user.id, '=', e.uuid(admin.id)) })),
        entity: e.select(e.Project, (project) => ({ filter: e.op(project.id, '=', e.uuid(id)) })),
        permissions: [Visibility.admin],
      });
      await run(admin3Query);

      const adminCaller = router.createCaller(createContext({ user: { id: admin.id } }));
      await expect(
        adminCaller.project.update({
          id,
          description: newDescription,
          visibility: Visibility.$public,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();

      await caller.project.update({ id, visibility: Visibility.member });
      await adminCaller.project.update({
        id,
        description: newDescription,
        visibility: Visibility.$public,
      });

      await expect(getTestableProject(name)).resolves.toMatchSnapshot();
    });
  });
});

const description = 'This needs to be at least 50 characters';

async function createUserWithAccount() {
  const username = 'test-user';
  const accessToken = 'this-is-an-access-token';
  const user = e.insert(e.User, { username });
  const account = e.insert(e.Account, {
    provider: 'github',
    providerAccountId: 'asdf',
    user,
    accessToken,
    login: 'test-user',
  });

  const [{ id }] = await run(e.set(user, account));

  return { username, accessToken, id };
}

async function setupAuthenticatedRouterCaller() {
  const { id } = await createUserWithAccount();
  const caller = router.createCaller(createContext({ user: { id } }));
  return { caller, id };
}

/** No ids or dates which change between test runs */
async function getTestableProject(name: string) {
  const projectQuery = e.select(e.Project, (project) => ({
    filter: e.op(project.name, '=', name),
    name: true,
    description: true,
    tags: { name: true },
    members: {
      permissions: true,
    },
    visibility: true,
  }));

  return await run(projectQuery);
}
