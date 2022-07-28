import type { Context } from '..';

export function createContext(context: Partial<Context> = {}): Context {
  return { env, ...context };
}

const env = {
  GITHUB_CLIENT_ID: '',
  GITHUB_CLIENT_SECRET: '',
  GITHUB_APP_NAME: '',
  GITHUB_APP_ID: '',
  GITHUB_APP_PRIVATE_KEY: '',
  GITHUB_WEBHOOK_SECRET: '',
};
