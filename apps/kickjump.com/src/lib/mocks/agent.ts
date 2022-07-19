import { MockAgent, setGlobalDispatcher } from 'undici';

export const agent = new MockAgent({});

export function mock() {
  setGlobalDispatcher(agent);
}
