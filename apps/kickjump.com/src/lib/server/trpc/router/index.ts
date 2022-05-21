import * as trpc from '@trpc/server';

import { transformer } from '../transformer';
import { metaRouter } from './meta-router';
import { projectsRouter } from './projects-router';

export const createContext = () => ({});

export const router = trpc
  .router<trpc.inferAsyncReturnType<typeof createContext>>()
  .transformer(transformer)
  .merge('meta:', metaRouter)
  .merge('projects:', projectsRouter);

export type Router = typeof router;
