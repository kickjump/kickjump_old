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
export function redirect(url: string | URL, init?: number | ResponseInit): Response {
  let responseInit: ResponseInit = {};

  if (typeof init === 'number') {
    responseInit = { status: init };
  } else if (typeof init?.status === 'undefined') {
    responseInit.status = 302;
  }

  const headers = new Headers(responseInit.headers);
  headers.set('Location', typeof url === 'string' ? url : url.toString());

  return new Response(null, { ...responseInit, headers });
}

/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 */
export function json<Data = object>(data: Data, init: number | ResponseInit = {}): Response {
  let responseInit: ResponseInit = {};

  if (typeof init === 'number') {
    responseInit = { status: init };
  } else if (typeof init?.status === 'undefined') {
    responseInit.status = 302;
  }

  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers,
  });
}