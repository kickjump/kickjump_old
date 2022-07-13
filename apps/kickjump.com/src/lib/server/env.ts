import 'dotenv/config';

import { browser } from '$app/env';

const ERROR_STRING = '$$_ERROR_RORRE_$$';

class EnvironmentError extends Error {
  constructor(message: string) {
    super(`Missing environment variable: ${message}`);
    this.name = 'EnvironmentError';
  }
}

export const env = {
  GITHUB_CLIENT_ID: browser ? '' : process.env.GITHUB_CLIENT_ID ?? ERROR_STRING,
  GITHUB_CLIENT_SECRET: browser ? '' : process.env.GITHUB_CLIENT_SECRET ?? ERROR_STRING,
  GITHUB_APP_NAME: browser ? '' : process.env.GITHUB_APP_NAME ?? ERROR_STRING,
  GITHUB_APP_ID: browser ? '' : process.env.GITHUB_APP_ID ?? ERROR_STRING,
  GITHUB_APP_PRIVATE_KEY: browser ? '' : process.env.GITHUB_APP_PRIVATE_KEY ?? ERROR_STRING,
  SESSION_SECRET: browser ? '' : process.env.SESSION_SECRET ?? ERROR_STRING,
  SOLANA_RPC_SECRET: browser ? '' : process.env.SOLANA_RPC_SECRET ?? ERROR_STRING,
  DATABASE_URL: browser ? '' : process.env.DATABASE_URL ?? ERROR_STRING,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WEBSITE_URL: process.env.WEBSITE_URL || '',
  CF_PAGES: process.env.CF_PAGES === '1' ? true : false,
  CF_PAGES_URL: process.env.CF_PAGES_URL,
  CF_PAGES_BRANCH: process.env.CF_PAGES_BRANCH,
  PUBLIC_WEB3_AUTH_CLIENT_ID: process.env.VITE_WEB3_AUTH_CLIENT_ID,
  WEB3_AUTH_CLIENT_SECRET: process.env.WEB3_AUTH_CLIENT_SECRET,
};

for (const [name, value] of Object.entries(env)) {
  if (value === ERROR_STRING) {
    throw new EnvironmentError(name);
  }
}
