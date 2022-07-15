// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Router } from '../router';

import { createSvelteQueryTRPC, createSvelteQueryTRPCProxy, TRPCContext } from './trpc-context.js';

const svelteClient = createSvelteQueryTRPC<Router>();

/**
 * The endpoint for `trpc` requests.
 */
export const TRPC_ENDPOINT = '/trpc';
export const trpc = createSvelteQueryTRPCProxy(svelteClient);
export const { createClient } = svelteClient;
export { transformer } from './transformer.js';
export function context() {
  return TRPCContext.context<Router>();
}

export * as s from './structs.js';
export { type SSRState, TRPCContext } from './trpc-context.js';
export type { TRPCClient } from '@trpc/client';
export type { AnyRouter } from '@trpc/server';
