import { ProjectModel } from '@kickjump/db';
import { isReservedOrProfanity, ProjectUtils } from '@kickjump/types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { t } from '../init.js';
import { authenticated } from '../middleware.js';

export const project = t.router({
  create: authenticated
    .input(ProjectUtils.createSchema(isSlugAvailable))
    .mutation(async ({ ctx, input }) =>
      ProjectModel.createEssential({ creator: ctx.user.id, ...input }),
    ),
  slugAvailable: authenticated.input(z.string()).query(async ({ input }) => {
    const suggestions = await generateUsernames();

    return { available: await isSlugAvailable(input), suggestions };
  }),
  update: authenticated
    .input(
      z.object({
        id: z.string().uuid(),
        description: z.string().min(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { description, id } = input;
      const actions = ['update.description'] as const;
      const permitted = await ProjectModel.hasPermission({ actions, actor: user.id, project: id });

      if (!permitted) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `'${actions[0]}' is not permitted for the current user.`,
        });
      }

      return await ProjectModel.update({ id, description });
    }),
});

async function isSlugAvailable(slug: string) {
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
