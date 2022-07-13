import invariant from 'tiny-invariant';

import { env } from '$server/env';

/**
 * Return `true` when the site is deployed in production.
 */

export function isProduction() {
  // TODO(@ifiokjr) verify on fly.io
  return env.NODE_ENV === 'production' && env.CF_PAGES_BRANCH === 'production';
}
/**
 * Consistently determine the API URL for the current client even when in a
 * deploy preview or similar.
 *
 * Non empty paths should be left empty or prefixed with a `/` to represent the
 * absolute URL.
 */

export function getAbsoluteUrl(path?: string, forceProtocol = false): string {
  if (path === '/' || path === undefined) {
    path = '';
  }

  invariant(
    path === '' || (path.length > 1 && path.startsWith('/')),
    'The path must either be left empty or start with `/`',
  );

  // In the browser we just use a relative URL and everything works.
  if (typeof document !== 'undefined') {
    return forceProtocol ? new URL(path || '', window.location.origin).toString() : path || '/';
  }

  // This should be populated on cloudflare pages.
  if (env.CF_PAGES_URL) {
    return env.CF_PAGES_URL;
  }

  // This is used for local deployments.
  if (env.WEBSITE_URL) {
    return `${env.WEBSITE_URL}${path}`;
  }

  if (!isProduction()) {
    // We replace https:// from the URL if it exists and add it ourselves always at the beginning as the above environment variables are not guaranteed to include it
    return `https://dev.kickjump.com${path}`;
  }

  return `https://kickjump.com${path}`;
}
