import type { Handle, RequestEvent, RequestHandler } from '@sveltejs/kit';
import { randomBytes } from 'node:crypto';
import { match } from 'path-to-regexp';

import { verifyCsrf } from '../csrf.js';
import { ServerError } from '../errors.js';
import { json, redirect } from '../utils.js';
import type { Authenticator } from './authenticator.js';
import { getRedirectFromURL } from './strategy.js';

const ALLOWED_METHODS = new Set(['GET', 'POST']);

/**
 * Create the authentication handle This is attached to the `authenticator` object.
 *
 * @internal
 */
export function createAuthHandle(auth: Authenticator): Handle {
  return async function authHandle(props) {
    const { event, resolve } = props;

    if (!event.url.pathname.startsWith(`${auth.options.basePath}/`)) {
      return await resolve(event);
    }

    let serverError: ServerError;

    if (ALLOWED_METHODS.has(event.request.method)) {
      try {
        for (const [path, fn] of Object.entries(AUTH_ENDPOINTS)) {
          const matcher = match<Record<string, string>>(`${auth.options.basePath}${path}`);
          const matched = matcher(event.url.pathname);

          if (!matched) {
            continue;
          }

          if (event.request.method === 'POST') {
            verifyCsrf({ locals: event.locals });
          }

          const request = event.request.clone();
          const authParams = matched.params;

          return await fn({ ...event, request, auth, authParams });
        }
      } catch (error) {
        // This allows throwing a response in oauth callbacks.
        if (error instanceof Response) {
          return error;
        }

        serverError = ServerError.as(error);

        if (serverError.response) {
          return serverError.response;
        }
      }
    }

    serverError ??= new ServerError({
      code: 'NotFound',
      message: `The authentication endpoint: ${event.url.pathname} requested was not found`,
    });

    await event.locals.session.flash('authError', serverError.toJSON());

    if (event.request.method === 'POST') {
      return json(serverError.toJSON());
    }

    const redirectTo = getRedirectFromURL({
      defaultRedirect: auth.options.defaultRedirect,
      redirectParam: auth.options.redirectParam,
      url: event.url,
    });

    return redirect(redirectTo);
  };
}

const ACTION_STRATEGY_PATH = '/:action/:strategy';

const AUTH_ENDPOINTS: Record<string, EndpointHandler> = {
  [ACTION_STRATEGY_PATH]: async (props) => {
    const { auth, authParams, request, ...event } = props;
    const { action, strategy } = authParams;

    if (!(action && strategy)) {
      throw new ServerError({
        code: 'BadRequest',
        message: `Invalid action: '${action}' or strategy: '${strategy}' provided for ${event.url.pathname}`,
      });
    }

    return auth.authenticate({ ...event, action, strategy, request: request.clone() });
  },
  '/logout': async (props) => {
    const { auth, request, ...event } = props;
    const redirectTo = getRedirectFromURL({
      defaultRedirect: auth.options.defaultRedirect,
      redirectParam: auth.options.redirectParam,
      url: props.url,
    });

    await auth.logout({ ...event, request: request.clone(), redirectTo });

    if (request.method !== 'POST') {
      return redirect(redirectTo);
    }

    return json({ success: true, redirectTo });
  },
  '/hash': async (props) => {
    const hash = randomBytes(32).toString('base64');
    await props.locals.session.flash('hash', hash);
    return json({ hash });
  },
};

export interface AuthEndpoints {
  get: RequestHandler;
  post: RequestHandler;
}

interface EndpointProps extends RequestEvent {
  auth: Authenticator;
  authParams: Record<string, string>;
}

type EndpointHandler = (props: EndpointProps) => Promise<Response>;
