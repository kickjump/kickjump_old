// import { PublicKey } from '@solana/web3.js';
import * as s from 'superstruct';

// export function buffer(): s.Struct<Buffer, null> {
//   return s.define<Buffer>('buffer', (value) => Buffer.isBuffer(value));
// }

// export function publicKey(): s.Struct<PublicKey, null> {
//   return s.define<PublicKey>('publicKey', (value) => value instanceof PublicKey);
// }

export function uint8Array(): s.Struct<Uint8Array, null> {
  return s.define<Uint8Array>('uint8Array', (value) => value instanceof Uint8Array);
}

export function url(): s.Struct<URL, null> {
  return s.define<URL>('url', (value) => value instanceof URL);
}

export function slug(): s.Struct<string, null> {
  return s.refine(
    s.pattern(s.size(s.string(), 3, 20), /^(?=.{3,20}$)(?![._])(?!.*[._]{2})[\w.]+(?<![._])$/),
    'slug',
    () => true,
  );
}

export * from 'superstruct';
