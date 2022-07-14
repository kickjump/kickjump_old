import { t } from '../init.js';
import { github } from './github-router.js';
import { meta } from './meta-router';

export const router = t.router({ meta, github });

export type Router = typeof router;
