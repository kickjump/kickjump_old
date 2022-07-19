import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import SuperJson from 'superjson';

import * as s from './structs';

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

if (!BN.prototype.toBuffer && Buffer) {
  BN.prototype.toBuffer = function toBuffer(endian, length) {
    return this.toArrayLike(Buffer, endian, length);
  };
}

// Add support for automatic serialization of PublicKeys
SuperJson.registerCustom<PublicKey, string>(
  {
    isApplicable: (value): value is PublicKey => s.publicKey().is(value),
    serialize: (value) => value.toBase58(),
    deserialize: (value) => new PublicKey(value),
  },
  'publicKey',
);

// Add support for automatic serialization of Buffers
SuperJson.registerCustom<Buffer, number[]>(
  {
    isApplicable: (value): value is Buffer => s.buffer().is(value),
    serialize: (value) => [...value],
    deserialize: (value) => Buffer.from(value),
  },
  'buffer',
);

// Add support for automatic serialization of Uint8Array
SuperJson.registerCustom<Uint8Array, number[]>(
  {
    isApplicable: (value): value is Uint8Array => s.uint8Array().is(value),
    serialize: (value) => [...value],
    deserialize: (value) => Uint8Array.from(value),
  },
  'uint8Array',
);

SuperJson.registerCustom<URL, string>(
  {
    isApplicable: (value): value is URL => s.url().is(value),
    serialize: (value) => value.href,
    deserialize: (value) => new URL(value),
  },
  'url',
);

export { default as transformer } from 'superjson';
