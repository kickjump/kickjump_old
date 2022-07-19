import type { Handle } from '@sveltejs/kit';

import { agent, setGlobalFetchMock } from './agent.js';

interface CreateMockHandleProps {
  enabled?: boolean;
  preventUnmockedRequests?: boolean;
}

export function createMockHandle(props: CreateMockHandleProps = {}): Handle {
  const { enabled = false, preventUnmockedRequests = false } = props;

  return async ({ event, resolve }) => {
    if (enabled) {
      await import('./domains.js');
      setGlobalFetchMock();
    }

    if (preventUnmockedRequests) {
      // prevent any unmocked request - NOT currently recommanded.
      agent.disableNetConnect();
    }

    return await resolve(event);
  };
}
