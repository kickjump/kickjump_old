import { isNumber, isString } from 'is-what';
/**
 * Return this function in your svelte api to perform a redirect on the server.
 */
export function redirect(url: string | URL, init?: number | ResponseInit): Response {
  let responseInit: ResponseInit = {};

  responseInit = isNumber(init) ? { status: init } : init ?? {};

  if (!responseInit.status) {
    responseInit.status = 302;
  }

  const headers = new Headers(responseInit.headers);
  headers.set('Location', isString(url) ? url : url.href);

  return new Response(null, { ...responseInit, headers });
}

/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 */
export function json<Data = object>(data: Data, init: number | ResponseInit = {}): Response {
  let responseInit: ResponseInit = {};

  if (isNumber(init)) {
    responseInit = { status: init };
  } else if (typeof init?.status === 'undefined') {
    responseInit.status = 200;
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
