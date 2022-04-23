/**
 * The session key that holds where to redirect to. This is checked during
 * authentication to determine which page to go to on success.
 *
 * This can be stored in the session or in the url.
 */
export const NEXT_URL_KEY = '_next';

/**
 * The name the session is stored in.
 */
export const SESSION_NAME = '_session';

/**
 * The key used to store numbers used only one.
 */
export const SOLANA_HASH_KEY = 'solana-hash';

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
