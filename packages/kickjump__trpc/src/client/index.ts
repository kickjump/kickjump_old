// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { transformer } from '@kickjump/validation';
import type _webhooks from '@octokit/webhooks';

import type { Router } from '../router';
import { createSvelteQueryTRPC, createSvelteQueryTRPCProxy, TRPCContext } from './trpc-context.js';

const svelteClient = createSvelteQueryTRPC<Router>();

/**
 * The endpoint for `trpc` requests.
 */
export const TRPC_ENDPOINT = '/trpc';
export const trpc = createSvelteQueryTRPCProxy(svelteClient);
export function context() {
  return TRPCContext.context<Router>();
}

export function createClient(csrf: string) {
  return svelteClient.createClient({ csrf, url: TRPC_ENDPOINT, transformer });
}

export { type SSRState, TRPCContext } from './trpc-context.js';
export type { TRPCClient } from '@trpc/client';
export type { AnyRouter } from '@trpc/server';
