import { PublicKey } from '@solana/web3.js';
import * as s from 'superstruct';

export function buffer(): s.Struct<Buffer, null> {
  return s.define<Buffer>('buffer', (value) => Buffer.isBuffer(value));
}

export function uint8Array(): s.Struct<Uint8Array, null> {
  return s.define<Uint8Array>('uint8Array', (value) => value instanceof Uint8Array);
}

export function publicKey(): s.Struct<PublicKey, null> {
  return s.define<PublicKey>('publicKey', (value) => value instanceof PublicKey);
}

export * from 'superstruct';
