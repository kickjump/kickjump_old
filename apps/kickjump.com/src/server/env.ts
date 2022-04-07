import { envsafe, str } from 'envsafe';

export const env = envsafe({
  GITHUB_CLIENT_ID: str(),
  GITHUB_CLIENT_SECRET: str(),
  GITHUB_APP_ID: str(),
  GITHUB_APP_PRIVATE_KEY: str(),
  JWT_SECRET: str(),
  NEXTAUTH_SECRET: str(),
});
