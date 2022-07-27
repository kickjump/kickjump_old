// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { transformer } from '@kickjump/types';
import type _webhooks from '@octokit/webhooks';

import { TRPC_ENDPOINT } from '../constants';
import type { Router } from '../router';
import type { UseTRPCMutationOptions, UseTRPCQueryOptions } from './trpc-context.js';
import { createSvelteQueryTRPC, createSvelteQueryTRPCProxy, TRPCContext } from './trpc-context.js';

const svelteClient = createSvelteQueryTRPC<Router>();

export const trpc = createSvelteQueryTRPCProxy(svelteClient);
export function context() {
  return TRPCContext.context<Router>();
}

export function createClient() {
  return [
    svelteClient.createClient({ url: TRPC_ENDPOINT, transformer }),
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
