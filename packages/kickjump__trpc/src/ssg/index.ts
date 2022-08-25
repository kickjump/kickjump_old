import { createProxySSGHelpers } from './proxy.js';

export type { DecoratedProcedureSSGRecord } from './proxy';
export { createProxySSGHelpers } from './proxy';
export type { CreateSSGHelpers, CreateSSGHelpersOptions } from './ssg';
export { createSSGHelpers } from './ssg';

import { transformer } from '@kickjump/types';

import type { Context } from '../init.js';
import { router } from '../router/index.js';

/**
 * Prefetch SSG Helpers
 */
export function createSSG(context?: Partial<Context>) {
  return createProxySSGHelpers({ router, transformer, ctx: { ...DEFAULT_CONTEXT, ...context } });
}

const DEFAULT_CONTEXT: Context = {
  env: {
    GITHUB_APP_ID: '',
    GITHUB_APP_NAME: '',
    GITHUB_APP_PRIVATE_KEY: '',
    GITHUB_CLIENT_ID: '',
    GITHUB_CLIENT_SECRET: '',
    GITHUB_WEBHOOK_SECRET: '',
  },
};
