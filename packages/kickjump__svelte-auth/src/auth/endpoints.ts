import type { RequestEvent, RequestHandler, RequestHandlerOutput } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/private';
import { randomBytes } from 'node:crypto';
import { match } from 'path-to-regexp';

import { ServerError } from '../errors';
import { json, redirect } from '../utils';
import type { Authenticator } from './authenticator';
import { getRedirectFromURL } from './strategy';

export interface AuthEndpoints {
  get: RequestHandler;
  post: RequestHandler;
}

/**
 * Create the endpoint handlers for the authenticator.
 */
export function createAuthEndpoints(auth: Authenticator): AuthEndpoints {
  const handler: RequestHandler = async (event) => {
    let error: ServerError;
    try {
      for (const [path, fn] of Object.entries(AUTH_ENDPOINTS)) {
        const matcher = match<Record<string, string>>(`${auth.options.authPath}${path}`);
        const matched = matcher(event.url.pathname);

        if (!matched) {
          continue;
        }

        return fn({ ...event, request: event.request.clone(), auth, authParams: matched.params });
      }
    } catch (error_) {
      error = ServerError.as(error_);
    }

    error ??= new ServerError({
      code: 'NotFound',
      message: `The authentication endpoint: ${event.url.pathname} requested was not found`,
    });
    event.locals.session.flash('authError', error.toJSON());

    if (event.request.method === 'POST') {
      return json(error.toJSON());
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

interface EndpointProps extends RequestEvent {
  auth: Authenticator;
  authParams: Record<string, string>;
}

type EndpointHandler = (props: EndpointProps) => MaybePromise<RequestHandlerOutput>;

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
    props.locals.session.flash('hash', hash);
    return json({ hash });
  },
};
