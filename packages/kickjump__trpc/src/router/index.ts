import { t } from '../init.js';
import { github } from './github-router.js';
import { meta } from './meta-router';
import { project } from './project-router.js';
import { tag } from './tag-router.js';

export const router = t.router({ meta, github, project, tag });

export type Router = typeof router;
