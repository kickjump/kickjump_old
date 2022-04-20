import type { RequestHandler } from '@sveltejs/kit';
import { pathToRegexp } from 'path-to-regexp';

import type { Authenticator } from './authenticator';

export interface AuthEndpoints {
  get: RequestHandler;
  post: RequestHandler;
}

/**
 * Create the endpoint handlers for the authenticator.
 */
export function createAuthEndpoints(auth: Authenticator): AuthEndpoints {
  return {
    async get() {
      return new Response();
    },

    async post() {
      return new Response();
    },
  };
}
