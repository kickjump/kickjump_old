import type { Handle } from '@sveltejs/kit';

import { env } from '$server/env';

import { agent, mock } from './agent.js';

export function createMockHandle(): Handle {
  return async (props) => {
    const { event, resolve } = props;

    if (env.VITE_ENDPOINT_MOCKING_ENABLED === 'true') {
      const { mockDomains } = await import('./domains/index.js');
      mockDomains();
      mock();
    }

    if (process.env.E2E_TEST) {
      agent.disableNetConnect();
    }

    return await resolve(event);
  };
}
