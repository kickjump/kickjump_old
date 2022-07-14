import { transformer } from '$lib/transformer.js';
import { createSvelteQueryTRPC, createSvelteQueryTRPCProxy } from '$lib/trpc/trpc-store';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Router } from '$server/trpc/router';

import { TRPCContext } from './trpc-store.js';

const svelteClient = createSvelteQueryTRPC<Router>();
export const TRPC_ENDPOINT = '/trpc';
export const trpc = createSvelteQueryTRPCProxy(svelteClient);
export const { createClient } = svelteClient;
export const context = TRPCContext.context<Router>;
export const client = createClient({ url: TRPC_ENDPOINT, transformer });
