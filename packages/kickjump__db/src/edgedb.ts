import { type Executor, createClient } from 'edgedb';
import type _ from 'edgedb/dist/client.js';

export const client = createClient();

interface RunOptions {
  currentUser?: string;
  unsafeIgnorePolicies?: boolean;
}

export function run<Runner extends { run: (cxn: Executor) => any }>(
  runner: Runner,
  options?: RunOptions,
): ReturnType<Runner['run']> {
  const innerClient = options ? client.withGlobals(options) : client;
  return runner.run(innerClient);
}

export { default as e } from '@kickjump/edgedb';
export { $ } from 'edgedb';
