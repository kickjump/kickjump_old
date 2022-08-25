import { e, ProjectModel, run } from '@kickjump/db';
import type { CreateOmitKeys } from '@kickjump/types';
import { Visibility } from '@kickjump/types';
import { isProfanity, isReservedOrProfanity, ProjectUtils } from '@kickjump/types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { t } from '../init.js';
import { authenticated } from '../middleware.js';

export const project = t.router({
  create: authenticated
    .input(ProjectUtils.createSchema({ name: checkName }))
    .mutation(async ({ ctx, input }) => {
      const creator = e.select(e.User, (user) => ({
        filter: e.op(user.id, '=', e.uuid(ctx.user.id)),
      }));

      const entity = e.insert(e.Project, {
        name: input.name,
        description: input.description,
        visibility: input.visibility,
        status: input.status,
        creator,
      });

      const membership = e.insert(e.Membership, {
        entity,
        actor: creator,
        permissions: e.array([Visibility.owner]),
      });

      function createTags(tags: string[]) {
        return e.for(e.set(...tags), (name) => {
          return e.insert(e.Tag, { name, tagged: entity }).unlessConflict((tag) => ({
            on: tag.name,
            else: e.update(tag, () => ({ set: { tagged: { '+=': entity } } })),
          }));
        });
      }

      const tags = input.tags?.length ? [createTags(input.tags)] : ([] as const);

      const query = e.set(entity, membership, ...tags);
      const [{ id }] = await run(query);

      return id;
    }),

  nameAvailable: authenticated.input(z.string()).query(async ({ input }) => {
    const suggestions = await generateUsernames();

    return { available: await checkName(input), suggestions };
  }),

  update: authenticated
    .input(ProjectUtils.updateSchema({ tag: checkTag, name: checkTag }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const initialQuery = e.select(e.Project, (project) => ({
        visibility: true,
        members: e
          .select(project.members, (membership) => ({
            permissions: true,
            filter: e.op(membership.actor.id, '=', e.uuid(user.id)),
          }))
          .assert_single(),
        filter: e.op(project.id, '=', e.uuid(input.id)),
      }));
      const result = await run(initialQuery);
      const permissions = result?.members.at(0)?.permissions;
      const visibility = result?.visibility;

      if (!permissions || !visibility) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'This user is not a member and has insufficient permissions to make requested changes.',
        });
      }

      const checkPermissions = ProjectUtils.canUpdate({
        permissions,
        visibility,
        project: input,
      });

      if (!checkPermissions.allowed) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: checkPermissions.fields
            .map((field) => `Insufficient permissions to update field: '${field}'.`)
            .join('\n'),
        });
      }

      const updateProject: ProjectUtils.Type<{ simplify: true; omit: CreateOmitKeys }> =
        Object.create({ updatedAt: e.datetime_current() });

      if (input.description) {
        updateProject.description = input.description;
      }

      if (input.name) {
        updateProject.name = input.name;
      }

      if (input.status) {
        updateProject.status = input.status;
      }

      if (input.visibility) {
        updateProject.visibility = input.visibility;
      }

      const projectQuery = e.update(e.Project, (project) => ({
        filter: e.op(project.id, '=', e.uuid(input.id)),
        set: { updatedAt: e.datetime_current(), ...updateProject },
      }));

      function createAdded(tags: string[]) {
        return e.for(e.set(...tags), (name) => {
          return e.insert(e.Tag, { name, tagged: projectQuery }).unlessConflict((tag) => ({
            on: tag.name,
            else: e.update(tag, () => ({ set: { tagged: { '+=': projectQuery } } })),
          }));
        });
      }

      function createRemoved(tags: string[]) {
        return e.update(e.Tag, (tag) => ({
          filter: e.op(tag.name, 'in', e.set(...tags)),
          set: { tagged: { '-=': projectQuery } },
        }));
      }

      function createCleared() {
        return e.delete(e.Tag, (tag) => ({
          filter: e.op(tag.tagged, '=', projectQuery),
        }));
      }

      const addedTags =
        !input.tags?.removeAll && input.tags?.add ? [createAdded(input.tags?.add)] : ([] as const);
      const removedTags =
        !input.tags?.removeAll && input.tags?.remove
          ? [createRemoved(input.tags.remove)]
          : ([] as const);
      const clearedTags = input.tags?.removeAll ? [createCleared()] : ([] as const);

      const query = e.set(projectQuery, ...addedTags, ...removedTags, ...clearedTags);

      await run(query);
    }),
});

async function checkTag(name: string) {
  return !(await isProfanity(name));
}

async function checkName(name: string) {
  if (await isReservedOrProfanity(name)) {
    return false;
  }

  if (await ProjectModel.findByName(name)) {
    return false;
  }

  return true;
}

async function generateUsernames(length = 5) {
  const {
    uniqueNamesGenerator,
    adjectives,
    animals,
    colors,
    countries,
    languages,
    names,
    starWars,
  } = await import('unique-names-generator');

  return Array.from({ length }).map(() =>
    uniqueNamesGenerator({
      style: 'lowerCase',
      separator: '-',
      dictionaries: [adjectives, animals, colors, countries, languages, names, starWars],
    }),
  );
}
