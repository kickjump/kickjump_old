import { webcrypto as crypto } from 'node:crypto';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import { fetch, Headers, Request, Response } from 'undici';

const globals = {
  crypto,
  fetch,
  Response,
  Request,
  Headers,
  ReadableStream,
  TransformStream,
  WritableStream,
} as const;

// exported for dev/preview and node environments
export function installPolyfills() {
  for (const [name, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, name, {
      enumerable: true,
      configurable: true,
      value,
    });
  }
}
