import { envsafe, str } from 'envsafe';

export const env = envsafe({
  GITHUB_CLIENT_ID: str(),
  GITHUB_CLIENT_SECRET: str(),
  GITHUB_APP_ID: str(),
  GITHUB_APP_PRIVATE_KEY: str(),
  SESSION_SECRET: str(),
  SOLANA_RPC_SECRET: str(),
  DATABASE_URL: str(),
  NODE_ENV: str({
    allowEmpty: true,
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
});
