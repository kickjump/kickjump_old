import type { Handle } from '@sveltejs/kit';
import { MockAgent, setGlobalDispatcher } from 'undici';

interface CreateMockHandleProps {
  enabled?: boolean;
  preventUnmockedRequests?: boolean;
}

export function createMockHandle(props: CreateMockHandleProps = {}): Handle {
  const { enabled = false, preventUnmockedRequests = false } = props;

  return async ({ event, resolve }) => {
    let agent: MockAgent<MockAgent.Options> | undefined;

    if (enabled) {
      agent = new MockAgent({});
      const { setupDomains } = await import('./domains.js');
      setupDomains(agent);
      setGlobalDispatcher(agent);

      if (preventUnmockedRequests) {
        // prevent any unmocked request - NOT currently recommanded.
        agent.disableNetConnect();
      }
    }

    const response = await resolve(event);

    agent?.deactivate();
    await agent?.close();

    return response;
  };
}
