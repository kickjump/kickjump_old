import { teardown } from 'jest-process-manager';

export default async function globalTeardown() {
  await teardown();
}
