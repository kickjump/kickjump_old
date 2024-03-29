import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '~/server/app-router';
import { createContext } from '~/server/context';

export default createNextApiHandler({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,

  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },

  /**
   * Enable query batching
   */
  batching: { enabled: true },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
