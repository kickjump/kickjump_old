import { createTRPCClient } from '@trpc/client';

import type { AppRouter } from '~/server/app-router';

import { getUrl } from './core';

export const { mutation, query, subscription, runtime } = createTRPCClient<AppRouter>({
  url: getUrl('/trpc'),
});
