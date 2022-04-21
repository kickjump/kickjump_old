import type { MaybePromise, RequestEvent } from '@sveltejs/kit/types/private';

import type { ServerErrorJson } from '../errors';

export interface SessionUser extends App.User {
  /**
   * The strategy which was used to authenticate the user.
   */
  strategy: string;
}

interface BaseRedirectOptions extends RequestEvent {
  /**
   * The current redirect url taken from the request url.
   */
  redirectTo: URL;
}

interface SuccessRedirectOptions extends BaseRedirectOptions {
  user: SessionUser;
  error?: never;
  action?: never;
  strategy?: never;
}

interface FailureRedirectOptions extends BaseRedirectOptions {
  error: unknown;
  user?: never;
  action?: never;
  strategy?: never;
}

interface StrategyRedirectOptions extends BaseRedirectOptions {
  error?: never;
  user?: never;
  action: string;
  strategy: string;
}

export type RedirectOptions =
  | SuccessRedirectOptions
  | FailureRedirectOptions
  | StrategyRedirectOptions;

/**
 * Extra information from the Authenticator to the strategy
 */
export interface AuthenticateOptions {
  /**
   * The default path to redirect to when no redirect parameter is set.
   *
   * @default '/'
   */
  defaultRedirect?: string;

  /**
   * The parameter in the url which stores the redirect path.
   *
   * @default 'redirect'
   *
   * Example: `https://mysite.com/login?redirect=/dashboard`
   */
  redirectParam?: string;

  /**
   * Determines where the user should be redirected to after a successful or unsuccessful authentication attempt.
   */
  redirect?: (options: RedirectOptions) => MaybePromise<URL>;
}

export interface AuthenticatorOptions extends AuthenticateOptions {
  /**
   * The url origin of the site.
   *
   * e.g. `https://mysite.com`
   */
  origin: string;

  /**
   * The path to the authentication route.
   *
   * @default `/api/auth`
   */
  authPath?: string;
}

export interface AuthenticateProps extends RequestEvent {
  /**
   * The strategy to use for authentication.
   */
  strategy: string;

  /**
   * The action string to use for authentication.
   */
  action: string;
}

export interface StrategyRequestEvent extends RequestEvent {
  /**
   * The options that were passed to the strategy.
   */
  options: Required<AuthenticateOptions>;
}

export interface StrategyAuthenticateProps extends StrategyRequestEvent {
  /**
   * The action that was invoked.
   */
  action: string;
}

declare global {
  namespace App {
    interface User {}
    interface Session {
      /**
       * An authentication error occurred. This could be a failure to
       * authenticate, but might also be a failure to connect the user account.
       */
      authError?: ServerErrorJson;

      /**
       * The user data  which is defined when the user is logged in.
       */
      user?: SessionUser;

      /**
       * A one time hash token. This can be used to provide an additional
       * security step when connecting crypto wallets.
       */
      hash?: string;
    }
  }
}