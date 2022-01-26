/**
 * The logger used when running scripts.
 */

/**
 * Return `true` when the site is deployed in production.
 */
export function isProduction() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}

/**
 * Consistently determine the API URL for the current client even when in a
 * deploy preview or similar.
 */
export function getUrl(path?: string): string {
  // In the browser we just use a relative URL and everything works perfectly
  if (process.browser) {
    return path ?? '';
  }

  if (process.env.WEBSITE_URL) {
    return `${process.env.WEBSITE_URL}${path ?? ''}`;
  }

  if (process.env.NODE_ENV === `development`) {
    return `http://localhost:3000${path ?? ''}`;
  }

  if (process.env.NEXTAUTH_URL) {
    return `${process.env.NEXTAUTH_URL}${path ?? ''}`;
  }

  // Infer the deploy URL if we're in production
  // VERCEL_URL = Vercel, DEPLOY_URL = Netlify
  const PROVIDER_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (PROVIDER_URL && !isProduction()) {
    // We replace https:// from the URL if it exists and add it ourselves always at the beginning as the above environment variables are not guaranteed to include it
    return `https://${PROVIDER_URL.replace(/^https?:\/\//, '')}${path ?? ''}`;
  }

  return `https://kickjump.com${path ?? ''}`;
}

/**
 * Removes all undefined values from an object. Neither Firestore nor the RealtimeDB allow `undefined` as a value.
 *
 * @param data The object to clean
 */
export function removeUndefined<Shape extends object>(data: Shape) {
  const transformed = Object.create({});

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    transformed[key] = value;
  }

  return transformed;
}

export * as log from 'next/dist/build/output/log';
