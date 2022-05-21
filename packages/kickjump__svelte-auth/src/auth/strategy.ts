import type { StrategyAuthenticateProps, StrategyRequestEvent } from './auth-types.js';

/**
 * A function which will be called to find the user using the information the
 * strategy got from the request.
 *
 * @param params The params from the strategy.
 * @returns The user data.
 * @throws {ServerError} If the user was not found. Any other error will be
 * ignored and thrown again by the strategy.
 */
export type StrategyVerifyCallback<VerifyParams> = (params: VerifyParams) => Promise<App.User>;

/**
 * The Strategy class is the base class every strategy should extend.
 *
 * This class receives two generics, a User and a VerifyParams.
 * - User is the type of the user data.
 * - VerifyParams is the type of the params the verify callback will receive from the strategy.
 *
 * This class also defines as protected two methods, `success` and `failure`.
 * - `success` is called when the authentication was successful.
 * - `failure` is called when the authentication failed.
 * These methods helps you return or throw the correct value, response or error
 * from within the strategy `authenticate` method.
 */
export abstract class Strategy<VerifyOptions> {
  /**
   * The name of the strategy.
   * This will be used by the Authenticator to identify and retrieve the
   * strategy.
   */
  abstract name: string;

  constructor(protected verify: StrategyVerifyCallback<VerifyOptions>) {}

  /**
   * The authentication flow of the strategy.
   *
   * This method receives the Request to authenticator and the session storage
   * to use from the Authenticator. It may receive a custom callback.
   *
   * At the end of the flow, it will return a Response to be used by the
   * application.
   */
  abstract authenticate(event: StrategyAuthenticateProps): Promise<App.User>;

  /**
   * Can be overridden for each custom strategy.
   */
  getRedirectUrl(event: StrategyRequestEvent): URL {
    const { options, url } = event;

    return getRedirectFromURL({
      url,
      redirectParam: options.redirectParam,
      defaultRedirect: options.defaultRedirect,
    });
  }
}

interface GetRedirectFromUrl {
  url: URL | string;
  redirectParam: string;
  defaultRedirect: string;
}

export function getRedirectFromURL(options: GetRedirectFromUrl): URL {
  const url = typeof options.url === 'string' ? new URL(options.url) : options.url;
  const redirect = url.searchParams.get(options.redirectParam);

  if (!redirect) {
    return new URL(options.defaultRedirect, url.origin);
  }

  return new URL(decodeURIComponent(redirect), url.origin);
}

export type AnyStrategy = Strategy<any>;
