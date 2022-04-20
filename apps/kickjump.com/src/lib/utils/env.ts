import { browser } from '$app/env';

const ERROR_STRING = '$$_ERROR_RORRE_$$';

class EnvironmentError extends Error {
  constructor(message: string) {
    super(`Missing environment variable: ${message}`);
    this.name = 'EnvironmentError';
  }
}

export const env = {
  GITHUB_CLIENT_ID: import.meta.env.GITHUB_CLIENT_ID || browser ? '' : ERROR_STRING,
  GITHUB_CLIENT_SECRET: import.meta.env.GITHUB_CLIENT_SECRET || browser ? '' : ERROR_STRING,
  GITHUB_APP_ID: import.meta.env.GITHUB_APP_ID || browser ? '' : ERROR_STRING,
  GITHUB_APP_PRIVATE_KEY: import.meta.env.GITHUB_APP_PRIVATE_KEY || browser ? '' : ERROR_STRING,
  SESSION_SECRET: import.meta.env.SESSION_SECRET || browser ? '' : ERROR_STRING,
  SOLANA_RPC_SECRET: import.meta.env.SOLANA_RPC_SECRET || browser ? '' : ERROR_STRING,
  DATABASE_URL: import.meta.env.DATABASE_URL || browser ? '' : ERROR_STRING,
  NODE_ENV: import.meta.env.DATABASE_URL || 'development',
  WEBSITE_URL: import.meta.env.WEBSITE_URL || '',
  CF_PAGES: import.meta.env.CF_PAGES === 1 ? true : false,
  CF_PAGES_URL: import.meta.env.CF_PAGES_URL || 'development',
  CF_PAGES_BRANCH: import.meta.env.CF_PAGES_BRANCH || 'development',
};

for (const [name, value] of Object.entries(env)) {
  if (value === ERROR_STRING) {
    throw new EnvironmentError(name);
  }
}
