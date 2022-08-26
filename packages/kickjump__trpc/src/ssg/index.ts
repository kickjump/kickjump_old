import { transformer } from '@kickjump/types';

import { type Context, DEFAULT_CONTEXT } from '../init.js';
import { router } from '../router/index.js';
import { createProxySSGHelpers } from './proxy.js';

export type { DecoratedProcedureSSGRecord } from './proxy.js';
export { createProxySSGHelpers } from './proxy.js';
export type { CreateSSGHelpers, CreateSSGHelpersOptions } from './ssg.js';
export { createSSGHelpers } from './ssg.js';

/**
 * Prefetch SSG Helpers
 */
export function ssgRouter(context?: Partial<Context>) {
  return createProxySSGHelpers({ router, transformer, ctx: { ...DEFAULT_CONTEXT, ...context } });
}
