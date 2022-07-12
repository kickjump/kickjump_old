import { createTRPCClient, createTRPCClientProxy } from '@trpc/client';

import type { Router } from '$server/trpc/router'; // 👈 only the types are imported from the server

import { transformer } from './transformer.js';

export const TRPC_ENDPOINT = '/trpc';
const client = createTRPCClient<Router>({ url: TRPC_ENDPOINT, transformer });
export const trpc = createTRPCClientProxy(client);
