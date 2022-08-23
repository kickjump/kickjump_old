import { type MutationOptions, type QueryClientConfig, QueryClient } from '@tanstack/query-core';
import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

export function createQueryClient(config?: QueryClientConfig): QueryClient {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  return new QueryClient({ logger: mockLogger, ...config });
}

export function mockVisibilityState(value: DocumentVisibilityState) {
  return vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(value);
}

export function mockNavigatorOnLine(value: boolean) {
  return vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(value);
}

export const mockLogger = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

let queryKeyCount = 0;
export function queryKey(): string[] {
  queryKeyCount++;
  return [`query_${queryKeyCount}`];
}

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout);
  });
}

/**
 * Assert the parameter is of a specific type.
 */
export const expectType = <T>(_: T): void => undefined;

/**
 * Assert the parameter is not typed as `any`
 */
export const expectTypeNotAny = <T>(_: 0 extends 1 & T ? never : T): void => undefined;

export const executeMutation = (
  queryClient: QueryClient,
  options: MutationOptions<any, any, any, any>,
): Promise<unknown> => {
  return queryClient.getMutationCache().build(queryClient, options).execute();
};

export function setupJestDomMatchers() {
  expect.extend(matchers);
}
