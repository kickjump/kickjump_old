import { ProjectModel } from '@kickjump/db';
import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';

const NOT_FOUND = { status: 404 } as const;

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
  const { slug } = event.params;

  if (!slug) {
    return NOT_FOUND;
  }

  const project = await ProjectModel.findBySlug(slug);

  if (!project) {
    return NOT_FOUND;
  }

  return {
    status: 200,
    body: { project },
  };
}
