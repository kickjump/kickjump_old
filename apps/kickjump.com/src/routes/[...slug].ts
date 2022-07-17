import { ProjectModel } from '@kickjump/db';
import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';

import type { RequestHandler } from './__types/[...slug].js';

export const GET: RequestHandler = async (event: RequestEvent): Promise<RequestHandlerOutput> => {
  const NOT_FOUND = { status: 404 } as const;
  const { slug } = event.params;

  if (!slug) {
    return NOT_FOUND;
  }

  const project = await ProjectModel.findBySlug(slug);

  if (!project) {
    return {
      status: 404,
    };
  }

  return {
    status: 200,
    body: { project },
  };
};
