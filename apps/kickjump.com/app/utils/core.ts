import type { Transaction } from '@solana/web3.js';
import invariant from 'tiny-invariant';

import { NEXT_URL_KEY } from './constants';

/**
 * Return `true` when the site is deployed in production.
 */
export function isProduction() {
  return process.env.FLY_APP_NAME === 'kickjump'; // TODO: verify that this is the right way to do this
}

/**
 * Consistently determine the API URL for the current client even when in a
 * deploy preview or similar.
 *
 * Non empty paths should be left empty or prefixed with a `/` to represent the
 * absolute URL.
 */
export function getAbsoluteUrl(path?: string, forceProtocol = false): string {
  invariant(
    path === undefined || (path.length > 1 && path.startsWith('/')),
    'The path must either be left empty or start with `/`',
  );

  // In the browser we just use a relative URL and everything works.
  if (typeof document !== 'undefined') {
    return forceProtocol ? new URL(path || '', window.location.origin).toString() : path || '/';
  }

  if (process.env.WEBSITE_URL) {
    return `${process.env.WEBSITE_URL}${path}`;
  }

  if (!isProduction()) {
    // We replace https:// from the URL if it exists and add it ourselves always at the beginning as the above environment variables are not guaranteed to include it
    return `https://dev.kickjump.com${path}`;
  }

  return `https://kickjump.com${path}`;
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

const encoder = new TextEncoder();

/**
 * Encode a string for passing through to an anchor program.
 */
export function stringToUint8Array(text: string): Uint8Array {
  return encoder.encode(text);
}

const decoder = new TextDecoder();

/**
 * Decode a Uint8Array to a string.
 */
export function uint8ArrayToString(input: Uint8Array) {
  return decoder.decode(input);
}

export function solanaTransactionBytes(transaction: Transaction) {
  return transaction.serialize();
}

/**
 * Decode a base64 string. Used to decode the GitHub App secret which is stored
 * as a base64 string.
 */
export function decodeBase64(value: string) {
  return Buffer.from(value, 'base64').toString('utf8');
}

/**
 * Add the desired `nextUrl` to the query string of the provided url.
 */
export function addNextUrlToQuery(to: string, next: string) {
  const url = new URL(getAbsoluteUrl(to, true));
  url.searchParams.set(NEXT_URL_KEY, encodeURIComponent(next));

  return `${url.pathname}${url.search}`;
}
