import { createClient } from 'edgedb';

import e from './generated/index.js';

const client = createClient({});

async function run() {
  const query = e.select(e.datetime_current());
  const result = await query.run(client);
  console.log(result);
}

run();

e.insert(e.User, {});
