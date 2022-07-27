import type { $ } from '@kickjump/db';
import { e, ProjectModel, run } from '@kickjump/db';
import { CreateOmitKeys, Visibility } from '@kickjump/types';
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
        })
      }

      let entries: Array<ReturnType<typeof createTags>> = [];
      if (input.tags?.length) {
        entries.push(createTags(input.tags));
      }


      const query = e.set(entity, membership, ...entries);
      await run(query);
    }),
  nameAvailable: authenticated.input(z.string()).query(async ({ input }) => {
    const suggestions = await generateUsernames();

    return { available: await checkName(input), suggestions };
  }),

  update: authenticated
    .input(ProjectUtils.updateSchema({ tag: isProfanity, name: isReservedOrProfanity }))
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
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Insuffient permissions' });
      }

      const checkPermissions = ProjectUtils.updatePermissions({
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

      const entries: [$.TypeSet, ...$.TypeSet[]] = [projectQuery];

      if (input.tags?.add) {
        const added = e.for(e.set(...input.tags.add), (name) => {
          return e.insert(e.Tag, { name, tagged: projectQuery }).unlessConflict((tag) => ({
            on: tag.name,
            else: e.update(tag, () => ({ set: { tagged: { '+=': projectQuery } } })),
          }));
        });

        entries.push(added);
      }

      if (input.tags?.remove) {
        const tagsToRemove = input.tags.remove;
        const removed = e.update(e.Tag, (tag) => ({
          filter: e.op(tag.name, 'in', e.set(...tagsToRemove)),
          set: { tagged: { '-=': projectQuery } },
        }));

        entries.push(removed);
      }

      await run(e.set(...entries));
    }),
});

async function checkName(slug: string) {
  if (await isReservedOrProfanity(slug)) {
    return false;
  }

  if (await ProjectModel.findByName(slug)) {
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
