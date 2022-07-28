import type { Handle } from '@sveltejs/kit';
import { MockAgent, setGlobalDispatcher } from 'undici';

interface CreateMockHandleProps {
  enabled?: boolean;
  preventUnmockedRequests?: boolean;
}

export function createMockHandle(props: CreateMockHandleProps = {}): Handle {
  const { enabled = false, preventUnmockedRequests = false } = props;

  return async ({ event, resolve }) => {
    let disableMocking: (() => Promise<void>) | undefined;

    if (enabled) {
      disableMocking = await setupMocking(preventUnmockedRequests);
    }

    const response = await resolve(event);
    await disableMocking?.();

    return response;
  };
}

export async function setupMocking(preventUnmockedRequests = false) {
  const agent = new MockAgent({});
  const { setupDomains } = await import('./domains.js');
  setupDomains(agent);
  setGlobalDispatcher(agent);

  if (preventUnmockedRequests) {
    // prevent any unmocked request - NOT currently recommanded.
    agent.disableNetConnect();
  }

  return async () => {
    agent.deactivate();
    await agent.close();
  };
}
