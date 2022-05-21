import { SvelteKitAuth } from 'sk-auth';

import { env } from '$server/env';
import { getAbsoluteUrl } from '$server/get-absolute-url';

import { getGitHubProfile, GITHUB_SCOPE, GitHubProvider } from './github-provider.js';

// Customize AuthConfig settings for development. Assumes callback URL
// of http://localhost:3000/api/auth/callback/github configured on GitHub.
const url = new URL(getAbsoluteUrl('/', true));

// Visit https://github.com/settings/applications/new
// to register a new OAuth application on GitHub
export const auth = new SvelteKitAuth({
  providers: [
    new GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      scope: GITHUB_SCOPE,
      profile: getGitHubProfile,
    }),
  ],
  callbacks: {
    redirect: (uri) => uri, // Extend or introspect redirect callbacks
    // ...and access to other available AuthCallbacks as well
  },
  protocol: url.protocol,
  host: url.host,
  basePath: '/api/auth',
  jwtSecret: env.SESSION_SECRET,
});
