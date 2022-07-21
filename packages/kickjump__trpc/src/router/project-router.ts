import { ProjectModel } from '@kickjump/db';
import { isReservedOrProfanity, setSlugAndTitle } from '@kickjump/types';
import { z } from 'zod';

import { t } from '../init.js';
import { authenticated } from '../middleware.js';

export const project = t.router({
  setSlugAndTitle: authenticated
    .input(setSlugAndTitle(isSlugAvailable))
    .mutation(async ({ ctx, input }) =>
      ProjectModel.createEssential({ creator: ctx.user.id, ...input }),
    ),
  slugAvailable: authenticated.input(z.string()).query(({ input }) => isSlugAvailable(input)),
  // update: authenticated.input(),
});

async function isSlugAvailable(slug: string) {
  if (await isReservedOrProfanity(slug)) {
    return false;
  }

  if (await ProjectModel.findBySlug(slug)) {
    return false;
  }

  return true;
}
