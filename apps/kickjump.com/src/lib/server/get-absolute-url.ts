import invariant from 'tiny-invariant';

import { env } from '$server/env';
/**
 * Return `true` when the site is deployed in production.
 */

export function isProduction() {
  // TODO(@ifiokjr) verify on fly.io
  return env.NODE_ENV === 'production' && env.VERCEL;
}

type NonEmptyString<Value extends string> = Value extends '' ? never : Value;

interface GetAbsoluteUrlProps<Url extends string> {
  path?: `/${NonEmptyString<Url>}`;
  forceProtocol?: boolean;
}

/**
 * Consistently determine the API URL for the current client even when in a
 * deploy preview or similar.
 *
 * Non empty paths should be left empty or prefixed with a `/` to represent the
 * absolute URL.
 */
export function getAbsoluteUrl<Url extends string>(props: GetAbsoluteUrlProps<Url> = {}): string {
  const { path, forceProtocol = false } = props;
  const suffix: string = path && path.length > 1 ? path : '';
  invariant(
    suffix === '' || (suffix.length > 1 && suffix.startsWith('/')),
    'The provided path must either be empty or start with a `/`',
  );

  // In the browser we just use a relative URL and everything works.
  if (typeof document !== 'undefined') {
    return forceProtocol ? new URL(suffix || '', window.location.origin).toString() : suffix || '/';
  }

  // This is used for local deployments.
  if (env.WEBSITE_URL) {
    return `${env.WEBSITE_URL}${suffix}`;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  if (!isProduction()) {
    return `https://dev.kickjump.com${suffix}`;
  }

  return `https://kickjump.com${suffix}`;
}
