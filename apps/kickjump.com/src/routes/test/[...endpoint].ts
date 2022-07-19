import { ServerError } from '@kickjump/svelte-auth';
import type { RequestHandler } from '@sveltejs/kit';

const handler: RequestHandler = async (event) => {
  const { endpoint } = event.params;

  if (!process.env.TEST || !process.env.E2E || !endpoint) {
    return {
      status: 404,
    };
  }

  return {
    status: 200,
  };
};

export { handler as DELETE, handler as GET, handler as OPTIONS, handler as PATCH, handler as POST };
