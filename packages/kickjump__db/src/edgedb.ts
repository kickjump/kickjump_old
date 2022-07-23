import { type Executor, createClient } from 'edgedb';
import type _ from 'edgedb/dist/client.js';
export * from '@kickjump/types/db';
export const client = createClient();

export function run<Runner extends { run: (cxn: Executor) => any }>(
  runner: Runner,
): ReturnType<Runner['run']> {
  return runner.run(client);
}

export { default as e } from '@kickjump/edgedb';
