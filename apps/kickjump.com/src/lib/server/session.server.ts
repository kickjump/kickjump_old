import { type Session, createCookieSessionStorage } from '@remix-run/node';

import { env } from '~/utils/env.server';

import { NEXT_URL_KEY, SESSION_NAME } from '../utils/constantsnstants';
import { getAbsoluteUrl } from '../utils/corels/core';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: SESSION_NAME,
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === 'production',
  },
});

/**
 * Get the session from the request object.
 */
export async function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

/**
 * Stores all data in the Session and returns the Set-Cookie header to be used in the HTTP response.
 */
export async function commitSession(session: Session) {
  return sessionStorage.commitSession(session);
}

/**
 * Set the redirect URL in the session. Set search params to include
 * `?nextUrl=/target` for activation.
 *
 * This uses `session.flash()` to ensure the value is not persisted after being
 * read.
 */
export async function addNextUrlToSession(request: Request, forceRedirect?: string): Promise<void> {
  const url = new URL(request.url);
  const session = await getSession(request);
  const redirect: string =
    forceRedirect || url.searchParams.get(NEXT_URL_KEY) || session.get(NEXT_URL_KEY);

  // By using flash the value will be cleared after being read.
  session.flash(NEXT_URL_KEY, redirect);
}

/**
 * Get the url to redirect to if one exists in the session.
 *
 * This will default to the session in the current URL if one exists.
 */
export async function getNextUrlFromSession(request: Request, fallback?: string): Promise<string> {
  const session = await getSession(request);
  const nextUrl =
    new URL(request.url).searchParams.get(NEXT_URL_KEY) || session.get(NEXT_URL_KEY) || fallback;

  return getAbsoluteUrl(nextUrl ? decodeURIComponent(nextUrl) : undefined);
}
