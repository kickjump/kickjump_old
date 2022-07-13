import { randomBytes } from 'node:crypto';

import type { StrategyAuthenticateProps, StrategyRequestEvent } from '../auth/auth-types.js';
import type { StrategyVerifyCallback } from '../auth/strategy.js';
import { Strategy } from '../auth/strategy.js';
import { ServerError } from '../errors.js';
import { redirect } from '../utils.js';

/**
 * The OAuth 2.0 authentication strategy authenticates requests using the OAuth
 * 2.0 framework.
 *
 * OAuth 2.0 provides a facility for delegated authentication, whereby users can
 * authenticate using a third-party service such as Facebook.  Delegating in
 * this manner involves a sequence of events, including redirecting the user to
 * the third-party service for authorization.  Once authorization has been
 * granted, the user is redirected back to the application and an authorization
 * code can be used to obtain credentials.
 *
 * Applications must supply a `verify` callback, for which the function
 * signature is:
 *
 *     function(accessToken, refreshToken, profile) { ... }
 *
 * The verify callback is responsible for finding or creating the user, and
 * returning the resulting user object.
 *
 * An AuthorizationError should be raised to indicate an authentication failure.
 *
 * Options:
 * - `authorizationUrl`  URL used to obtain an authorization grant
 * - `tokenUrl`          URL used to obtain an access token
 * - `clientId`          identifies client to service provider
 * - `clientSecret`      secret used to establish ownership of the client identifier
 * - `callbackUrl`       URL to which the service provider will redirect the user after obtaining authorization
 *
 * @example
 * authenticator.use(new OAuth2Strategy(
 *   {
 *     authorizationUrl: 'https://www.example.com/oauth2/authorize',
 *     tokenUrl: 'https://www.example.com/oauth2/token',
 *     clientId: '123-456-789',
 *     clientSecret: 'shhh-its-a-secret'
 *     callbackUrl: 'https://www.example.net/auth/example/callback'
 *   },
 *   async ({ accessToken, refreshToken, profile }) => {
 *     return await User.findOrCreate(...);
 *   }
 * ));
 */
export class OAuth2Strategy<
  Profile extends OAuth2Profile,
  ExtraParams extends object = object,
> extends Strategy<OAuth2StrategyVerifyParams<Profile, ExtraParams>> {
  name = 'oauth2';

  protected authorizationUrl: string;
  protected tokenUrl: string;
  protected clientId: string;
  protected clientSecret: string;

  constructor(
    options: OAuth2StrategyOptions,
    verify: StrategyVerifyCallback<OAuth2StrategyVerifyParams<Profile, ExtraParams>>,
  ) {
    super(verify);

    this.authorizationUrl = options.authorizationUrl;
    this.tokenUrl = options.tokenUrl;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
  }

  override async authenticate(event: StrategyAuthenticateProps): Promise<App.User> {
    const { url, locals, request, action, baseUrl } = event;
    const { session } = locals;
    const sessionUser = await session.get('user');

    // User has already authenticated with this strategy.
    if (sessionUser?.strategy === this.name) {
      return sessionUser;
    }

    // Redirect the user to the callback URL
    if (action === LOGIN_ACTION) {
      const state = this.generateState(event);
      await session.flash(SESSION_STATE_KEY, state);
      const authUrl = this.getAuthorizationURL({ request, state: state.id, baseUrl });

      const response = redirect(authUrl);
      // This throws a response which is picked up and returned by the handler.
      throw new ServerError({
        code: 302,
        message: `Redirecting to authorization url ${this.authorizationUrl}.`,
        response,
      });
    }

    if (action !== CALLBACK_ACTION) {
      throw new ServerError({
        code: 'NotAcceptable',
        message: `Invalid action '${action}' provided to '${this.name}' strategy`,
      });
    }

    const stateId = url.searchParams.get('state');

    if (!stateId) {
      throw new ServerError({ code: 400, message: `Missing state param on callback url.` });
    }

    const state = await session.get(SESSION_STATE_KEY);

    if (!state) {
      throw new ServerError({ code: 400, message: `Missing state in session.` });
    }

    if (state.id !== stateId) {
      throw new ServerError({
        code: 400,
        message: `State in session doesn't match state in callback url`,
      });
    }

    const code = url.searchParams.get('code');

    if (!code) {
      throw new ServerError({ code: 400, message: `Missing code in callback url` });
    }

    // Get the access token

    const params = new URLSearchParams(this.tokenParams());
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', this.getCallbackURL(baseUrl).toString());

    const data = await this.fetchAccessToken(code, params);
    const profile = await this.userProfile(data);
    const user = await this.verify({ ...data, profile });

    return { ...user, strategy: this.name };
  }

  /**
   * Retrieve user profile from service provider.
   *
   * OAuth 2.0-based authentication strategies can override this function in
   * order to load the user's profile from the service provider.  This assists
   * applications (and users of those applications) in the initial registration
   * process by automatically submitting required information.
   */
  protected async userProfile(_data: OAuth2Data<ExtraParams>): Promise<Profile> {
    return { provider: 'oauth2' } as Profile;
  }

  /**
   * Return extra parameters to be included in the authorization request.
   *
   * Some OAuth 2.0 providers allow additional, non-standard parameters to be
   * included when requesting authorization.  Since these parameters are not
   * standardized by the OAuth 2.0 specification, OAuth 2.0-based authentication
   * strategies can override this function in order to populate these
   * parameters as required by the provider.
   */
  protected authorizationParams(params: URLSearchParams): URLSearchParams {
    return new URLSearchParams(params);
  }

  /**
   * Return extra parameters to be included in the token request.
   *
   * Some OAuth 2.0 providers allow additional, non-standard parameters to be
   * included when requesting an access token.  Since these parameters are not
   * standardized by the OAuth 2.0 specification, OAuth 2.0-based authentication
   * strategies can override this function in order to populate these
   * parameters as required by the provider.
   */
  protected tokenParams(): URLSearchParams {
    return new URLSearchParams();
  }

  protected async getAccessToken(response: Response): Promise<OAuth2Data<ExtraParams>> {
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      ...extraParams
    } = await response.json();
    return { accessToken, refreshToken, ...extraParams };
  }

  private getCallbackURL(baseUrl: string): string {
    const { href } = new URL(`${CALLBACK_ACTION}/${this.name}`, baseUrl);

    return href;
  }

  private getAuthorizationURL(props: GetAuthorizationUrlProps) {
    const { request, state, baseUrl } = props;
    const params = new URLSearchParams(this.authorizationParams(new URL(request.url).searchParams));
    params.set('response_type', 'code');
    params.set('client_id', this.clientId);
    params.set('redirect_uri', this.getCallbackURL(baseUrl));
    params.set('state', state);

    const url = new URL(this.authorizationUrl);
    url.search = params.toString();

    return url;
  }

  private generateState(event: StrategyRequestEvent) {
    return { id: randomBytes(8).toString('hex'), redirect: this.getRedirectUrl(event).href };
  }

  /**
   * Format the data to be sent in the request body to the token endpoint.
   */
  private async fetchAccessToken(
    code: string,
    params: URLSearchParams,
  ): Promise<OAuth2Data<ExtraParams>> {
    params.set('client_id', this.clientId);
    params.set('client_secret', this.clientSecret);

    if (params.get('grant_type') === 'refresh_token') {
      params.set('refresh_token', code);
    } else {
      params.set('code', code);
    }

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      try {
        const body = await response.text();
        throw new Response(body, { status: 401 });
      } catch (error) {
        throw new Response((error as Error).message, { status: 401 });
      }
    }

    return await this.getAccessToken(response.clone() as unknown as Response);
  }
}

export const CALLBACK_ACTION = 'callback';
export const LOGIN_ACTION = 'login';
const SESSION_STATE_KEY = '_oath2:state' as const;

export type OAuth2Data<Extra extends object> = {
  accessToken: string;
  refreshToken: string;
} & Extra;
export interface OAuth2Profile {
  provider: string;
  id?: string | undefined;
  displayName?: string | undefined;
  name?: Name | string | undefined;
  emails: Email[];
  photos: Photo[];
}

interface Name {
  firstName?: string | undefined;
  lastName?: string | undefined;
  middleName?: string | undefined;
}

export interface Email {
  email: string;
  /** Extra meta data on the type of the email. */
  type?: string | undefined;
}

interface Photo {
  url: string;
  /** Extra meta data on the type of data. */
  type?: string | undefined;
}

export interface OAuth2StrategyOptions {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}

export type OAuth2StrategyVerifyParams<
  Profile extends OAuth2Profile,
  ExtraParams extends object = object,
> = {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
} & ExtraParams;

interface GetAuthorizationUrlProps {
  request: Request;
  state: string;
  baseUrl: string;
}

declare global {
  namespace App {
    interface Session {
      [SESSION_STATE_KEY]?: { id: string; redirect: string };
    }
  }
}
