import type { Transaction } from '@solana/web3.js';
import type { Page } from '@sveltejs/kit';

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

export function matchesHref(page: Page, href: string) {
  return !['/', ''].includes(page.url.pathname) && page.url.pathname.startsWith(href);
}
