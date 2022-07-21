import 'dotenv/config';

import { s } from '@kickjump/types';

const EnvSchema = s.type({
  VITE_ENDPOINT_MOCKING_ENABLED: s.optional(s.string()),
  NODE_ENV: s.optional(s.string()),
  VERCEL: s.optional(s.string()),
  VERCEL_URL: s.optional(s.string()),
  VERCEL_ENV: s.optional(s.string()),
  WEBSITE_URL: s.optional(s.string()),
  SESSION_SECRET: s.string(),
  SOLANA_RPC_SECRET: s.string(),
  GITHUB_CLIENT_ID: s.string(),
  GITHUB_CLIENT_SECRET: s.string(),
  GITHUB_APP_NAME: s.string(),
  GITHUB_APP_ID: s.string(),
  GITHUB_APP_PRIVATE_KEY: s.string(),
  GITHUB_WEBHOOK_SECRET: s.string(),
});

export const env = s.create(process.env, EnvSchema);
