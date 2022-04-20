import { type RequestHandlerOutput } from '@sveltejs/kit';
import { type RequestEvent } from '@sveltejs/kit/types/private';

/**
 * Get the session.
 */
export function getSession(event: RequestEvent): App.Session {
  return event.locals.session.data as App.Session;
}

/**
 * Return this function in your svelte api to perform a redirect on the server.
 */
export function redirect(url: string, init?: number | ResponseInit): Response {
  let responseInit: ResponseInit = {};

  if (typeof init === 'number') {
    responseInit = { status: init };
  } else if (typeof init?.status === 'undefined') {
    responseInit.status = 302;
  }

  const headers = new Headers(responseInit.headers);
  headers.set('Location', url);

  return new Response(null, { ...responseInit, headers });
}
