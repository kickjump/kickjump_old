import { type Context, t } from '../init.js';
import { github } from './github-router.js';
import { meta } from './meta-router.js';
import { project } from './project-router.js';
import { tag } from './tag-router.js';

export const router = t.router({ meta, github, project, tag });

/**
 * Use the router directly from the server.
 */
export function serverRouter(context: Context) {
  return router.createCaller({ ...context, private: true });
}

export type Router = typeof router;
