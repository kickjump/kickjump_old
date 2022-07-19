import type { Handle } from '@sveltejs/kit';

import { env } from '$server/env';

import { agent, mock } from './agent.js';

export function createMockHandle(): Handle {
  return async (props) => {
    const { event, resolve } = props;
    console.log('HERE I AM!!', env.VITE_ENDPOINT_MOCKING_ENABLED);

    if (env.VITE_ENDPOINT_MOCKING_ENABLED === 'true') {
      console.log('ENABLED!!!');
      const { mockDomains } = await import('./domains/index.js');
      mockDomains();
      mock();
    }

    if (process.env.E2E_TEST) {
      // prevent any unmocked arguments
      agent.disableNetConnect();
    }

    return await resolve(event);
  };
}
