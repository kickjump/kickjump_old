import type { DehydratedState } from '@kickjump/query';

import type { SeoProps } from './components/index.js';

/**
 * The entrypoint for all authentication endpoints.
 */
export const BASE_AUTH = '/auth';

interface Redirects {
  [from: string]: { to: string; status?: number };
}

/**
 * The redirects
 */
export const REDIRECTS: Redirects = {
  '/r/twitter': { to: 'https://twitter.com/kickjumpco', status: 302 },
  '/r/discord': { to: 'https://discord.gg/mzaFsAUn22', status: 302 },
  '/r/github': { to: 'https://github.com/kickjump/kickjump', status: 302 },
};

export const DEFAULT_SEO: SeoProps = {
  title: 'KickJump',
  description: 'Your toolkit for financially sustainable open source development.',
  twitter: {
    site: '@kickjumpco',
    title: 'KickJump',
    description: 'Your toolkit for financially sustainable open source development.',
  },
};

export const DEFAULT_DEHYDRATED_STATE: DehydratedState = { mutations: [], queries: [] };
