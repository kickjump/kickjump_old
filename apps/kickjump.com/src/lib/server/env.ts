import 'dotenv/config';

import { z } from 'zod';

const EnvSchema = z.object({
  VITE_ENDPOINT_MOCKING_ENABLED: z.string().optional(),
  NODE_ENV: z.string().optional(),
  VERCEL: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  WEBSITE_URL: z.string().optional(),
  SESSION_SECRET: z.string(),
  SOLANA_RPC_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_APP_NAME: z.string(),
  GITHUB_APP_ID: z.string(),
  GITHUB_APP_PRIVATE_KEY: z.string(),
  GITHUB_WEBHOOK_SECRET: z.string(),
});

export const env = EnvSchema.parse(process.env);
