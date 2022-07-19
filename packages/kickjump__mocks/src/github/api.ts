import { agent } from '../agent.js';

const API = 'https://api.github.com';
const api = agent.get(API);

api
  .intercept({
    path: '/example',
  })
  .reply(200, {
    value: { data: 'is good ' },
  });
