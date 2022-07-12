import type { RequestEvent, RequestHandler, RequestHandlerOutput } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/private';
import { randomBytes } from 'node:crypto';
import { match } from 'path-to-regexp';

import { verifyCsrf } from '../csrf.js';
import { ServerError } from '../errors.js';
import { json, redirect } from '../utils.js';
import type { Authenticator } from './authenticator.js';
import { getRedirectFromURL } from './strategy.js';

/**
 * Create the endpoint handlers for the authenticator.
 */
export function createAuthEndpoints(auth: Authenticator): AuthEndpoints {
  const handler: RequestHandler = async (event) => {
    let serverError: ServerError;

    try {
      for (const [path, fn] of Object.entries(AUTH_ENDPOINTS)) {
        const matcher = match<Record<string, string>>(`${auth.options.authPath}${path}`);
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
  return {
    get: handler,
    post: handler,
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

    const response = auth.logout({ ...event, request: request.clone(), redirectTo });

    return request.method === 'GET' ? response : { body: { logout: true } };
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

type EndpointHandler = (props: EndpointProps) => MaybePromise<RequestHandlerOutput>;
