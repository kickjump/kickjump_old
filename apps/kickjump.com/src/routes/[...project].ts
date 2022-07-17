import { ProjectModel } from '@kickjump/db';
import type { RequestEvent, RequestHandlerOutput } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<RequestHandlerOutput> {
  return {
    status: 404,
  };
}
