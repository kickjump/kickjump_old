import type { MockAgent } from 'undici';

export function test(agent: MockAgent<MockAgent.Options>) {
  const client = agent.get('https://custom.domain.com');

  client
    .intercept({
      path: '/test',
      method: 'GET',
    })
    .reply(200, { data: 'is good' }, {});
}
