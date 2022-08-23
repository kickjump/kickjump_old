import { transformer, TRPC_ENDPOINT } from '@kickjump/types';

import type { Router } from '../router';
import type { UseTRPCMutationOptions, UseTRPCQueryOptions } from './trpc-context.js';
import { createSvelteQueryTRPC, createSvelteQueryTRPCProxy, TRPCContext } from './trpc-context.js';

const svelteClient = createSvelteQueryTRPC<Router>();
export const trpc = createSvelteQueryTRPCProxy<Router>(svelteClient);
export function context() {
  return TRPCContext.context<Router>();
}

export function createClient(base: string | URL) {
  return [
    svelteClient.createClient({ url: new URL(TRPC_ENDPOINT, base).href, transformer }),
    svelteClient.setCrsf,
  ] as const;
}

export type InferInput<Type> = Type extends (opts: infer Opts, ...args: any[]) => any
  ? Opts extends UseTRPCMutationOptions<infer Input, any, any, any>
    ? Input
    : Opts extends UseTRPCQueryOptions<any, infer Input, any, any, any>
    ? Input
    : never
  : never;

export { type SSRState, TRPCContext } from './trpc-context.js';
export type { TRPCClient } from '@trpc/client';
export type { AnyRouter } from '@trpc/server';
