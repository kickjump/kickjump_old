import { agent } from './agent.js';

const client = agent.get('https://custom.domain.com');

client
  .intercept({
    path: '/test',
    method: 'GET',
  })
  .reply(200, { data: 'is good' }, {});
