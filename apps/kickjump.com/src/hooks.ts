import type { GetSession } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { auth } from '$lib/server/auth';

export const handler = sequence(
  /**
   * Set `event.locals.error` true if endpoint responds with
   * an http status code of 4xx or 5xx, or false otherwise.
   */
  async ({ event, resolve }) => {
    event.locals.error = false;
    let response = await resolve(event);

    if (response.status > 399 && response.status < 600) {
      event.locals.error = true;
      response = await resolve(event);
    }

    await response.json();

    return response;
  },
);

export const getSession: GetSession = async (request) => {
  const session = await auth.getSession(request);

  return { ...session, error: request.locals.error };
};
