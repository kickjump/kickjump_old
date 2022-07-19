import { randomBytes } from 'node:crypto';

import type { StrategyAuthenticateProps } from '../auth/auth-types.js';
import type { AuthenticateReturn, StrategyVerifyCallback } from '../auth/strategy.js';
import { Strategy } from '../auth/strategy.js';
import { ServerError } from '../errors.js';
import type { ServerSession } from '../session.js';
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

  override async authenticate(event: StrategyAuthenticateProps): Promise<AuthenticateReturn> {
    const { url, locals, request, action, baseUrl } = event;
    const { session } = locals;

    // Redirect the user to the callback URL
    if (action === LOGIN_ACTION) {
      const state = this.generateState(event);
      const authUrl = this.getAuthorizationURL({ request, state: state.id, baseUrl });
      const response = redirect(authUrl);

      await session.set(SESSION_STATE_KEY, state);

      // This throws a response which is picked up and returned by the handler.
      throw new ServerError({
        code: 302,
        message: `Redirecting to authorization url ${authUrl.href}.`,
        response,
      });
    }

    if (action !== CALLBACK_ACTION) {
      await this.handleCustomAction(event);
    }

    const code = this.verifyCode(url);
    const state = await this.verifyState(url, session);
    const params = new URLSearchParams(this.tokenParams());

    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', this.getCallbackURL(baseUrl));

    const data = await this.fetchAccessToken(code, params);
    const profile = await this.userProfile(data);
    const user = await this.verify({ ...data, profile, state });

    return { user, redirect: state.redirect };
  }

  /**
   * Verify that the state provided is identical to the state id stored in the
   * session. This mitigates CSRF attacks by using a unique and non-guessable
   * value associated with each authentication request.
   *
   * See more here: https://auth0.com/docs/secure/attack-protection/state-parameters
   */
  protected async verifyState(url: URL, session: ServerSession) {
    const paramState = url.searchParams.get('state');
    const state = session.get(SESSION_STATE_KEY);

    if (!paramState) {
      throw new ServerError({ code: 400, message: `Missing state param on callback url.` });
    }

    if (!state) {
      throw new ServerError({ code: 400, message: `Missing state in session.` });
    }

    if (state.id !== paramState) {
      throw new ServerError({
        code: 400,
        message: `State in session doesn't match state in callback url`,
      });
    }

    await session.unset(SESSION_STATE_KEY);

    return state;
  }

  private verifyCode(url: URL) {
    const code = url.searchParams.get('code');

    if (!code) {
      throw new ServerError({ code: 400, message: `Missing code in callback url` });
    }

    return code;
  }

  /**
   * Override this method to handle custom actions. The method should always
   * throw an error.
   *
   * Throwing a response will use the response provided.
   */
  protected async handleCustomAction(event: StrategyAuthenticateProps): Promise<never> {
    throw new ServerError({
      code: 'NotAcceptable',
      message: `Invalid action '${event.action}' provided to '${this.name}' strategy`,
    });
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
    } = (await response.json()) as any;
    return { accessToken, refreshToken, ...extraParams };
  }

  private getCallbackURL(baseUrl: string): string {
    const { href } = new URL(`${CALLBACK_ACTION}/${this.name}`, baseUrl);

    return href;
  }

  private getAuthorizationURL(props: GetAuthorizationUrlProps) {
    const { request, state, baseUrl } = props;
    const url = new URL(this.authorizationUrl);

    url.search = this.authorizationParams(new URL(request.url).searchParams).toString();
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.getCallbackURL(baseUrl));
    url.searchParams.set('state', state);

    return url;
  }

  /**
   * Generate the oauth state.
   *
   * Used to track the action that led to the callback being called.
   *
   * This is also used to verify that the installation is valid.
   */
  protected generateState(
    event: Pick<StrategyAuthenticateProps, 'action' | 'url' | 'options' | 'baseUrl'>,
  ): OAuth2State {
    const { action, options, url, baseUrl } = event;
    const id = randomBytes(8).toString('hex');
    const redirect = this.getRedirectUrl({ options, url, baseUrl }).href;

    return { id, redirect, action };
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
        throw new ServerError({ code: 401, message: body });
      } catch (error) {
        throw ServerError.as(error, 401);
      }
    }

    return await this.getAccessToken(response.clone());
  }
}

interface OAuth2State {
  [key: string]: unknown;
  id: string;
  redirect: string;
  action: string;
}

export const CALLBACK_ACTION = 'callback';
export const LOGIN_ACTION = 'login';
export const SESSION_STATE_KEY = 'oauth2:state' as const;

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
  /**
   * The state used to trigger the callback.
   */
  state: OAuth2State;
} & ExtraParams;

interface GetAuthorizationUrlProps {
  request: Request;
  state: string;
  baseUrl: string;
}

declare global {
  namespace App {
    interface Session {
      [SESSION_STATE_KEY]?: OAuth2State;
    }
  }
}
