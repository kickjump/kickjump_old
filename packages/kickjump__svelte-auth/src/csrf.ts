import type { RequestEvent } from '@sveltejs/kit/types/private';
import { randomUUID } from 'node:crypto';

import { ServerError } from './errors';
import { getSession } from './utils';

const CSRF_KEY = 'csrf' as const;
const CSRF_HEADER_KEY = 'x-csrf-token';

/**
 * Create a random string in Base64 to be used as an authenticity token for
 * CSRF protection. You should run this in the `hooks.ts` `handler()` function.
 */
export function createCsrf(event: RequestEvent) {
  const csrf = randomUUID();
  event.locals.session.set(CSRF_KEY, csrf);

  return csrf;
}

/**
 * Verify if a request and session has a valid CSRF token.
 */
export async function verifyCsrf(event: RequestEvent) {
  const { request } = event;
  const session = getSession(event);

  if (request.bodyUsed) {
    throw new Error(
      'The body of the request was read before calling verifyCsrf. Ensure you clone it before reading it.',
    );
  }

  // We clone the request to ensure we don't modify the original request.
  // This allow us to parse the body of the request and let the original request
  // still be used and parsed without errors.
  const formData = await request.clone().formData();

  // if the session doesn't have a csrf token, throw an error
  if (!session[CSRF_KEY]) {
    throw new ServerError('UnprocessableEntityWebDav', "Can't find CSRF token in session.");
  }

  const csrf = formData.get(CSRF_KEY) || request.headers.get(CSRF_HEADER_KEY);

  // if the body doesn't have a csrf token, throw an error
  if (!csrf) {
    throw new ServerError('UnprocessableEntityWebDav', "Can't find CSRF token in body.");
  }

  // if the body csrf token doesn't match the session csrf token, throw an
  // error
  if (csrf !== session.csrf) {
    throw new ServerError('UnprocessableEntityWebDav', "CSRF token doesn't match session.");
  }
}

declare global {
  namespace App {
    interface Session {
      /**
       * The CSRF token which is automatically added.
       */
      [CSRF_KEY]: string;
    }
  }
}
