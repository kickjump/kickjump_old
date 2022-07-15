import type { Handle, RequestEvent } from '@sveltejs/kit';

import { ServerError } from '../errors.js';
import { redirect as redirectResponse } from '../utils.js';
import type { AuthenticateProps, AuthenticatorOptions } from './auth-types.js';
import { createAuthHandle } from './endpoints.js';
import type { AnyStrategy, Strategy } from './strategy.js';

export type AuthenticateCallback<User> = (user: User) => Promise<Response>;

export class Authenticator {
  /**
   * A map of the configured strategies, the key is the name of the strategy
   * @private
   */
  readonly #strategies = new Map<string, Strategy<never>>();
  readonly #options: Required<AuthenticatorOptions>;
  /**
   * The base url based on the configuration. The URL ends with `/` for use with
   * `new URL('path/to', baseUrl)`;
   */
  readonly baseUrl: string;

  /**
   * Get the authentication handle which can be applied to the `hooks.ts` file.
   */
  get handle(): Handle {
    return createAuthHandle(this);
  }

  /**
   * The options provided at initialization.
   */
  get options(): Required<AuthenticatorOptions> {
    return this.#options;
  }

  /**
   * Create a new instance of the Authenticator.
   */
  constructor(options: AuthenticatorOptions) {
    this.#options = {
      basePath: options.basePath ?? '/auth',
      origin: options.origin,
      redirect: ({ url }) => url,
      redirectParam: 'redirect',
      defaultRedirect: '/',
    };

    const url = new URL(this.options.basePath, this.options.origin).href;
    this.baseUrl = url.endsWith('/') ? url : `${url}/`;
  }

  /**
   * Call this method with the Strategy, the optional name allows you to setup
   * the same strategy multiple times with different names.
   * It returns the Authenticator instance for concatenation.
   * @example
   * authenticator
   *  .use(new SomeStrategy({}, (user) => Promise.resolve(user)))
   *  .use(new SomeStrategy({}, (user) => Promise.resolve(user)), "another");
   */
  use(strategy: AnyStrategy, name?: string): Authenticator {
    this.#strategies.set(name ?? strategy.name, strategy);
    return this;
  }

  /**
   * Call this method with the name of the strategy you want to remove.
   * It returns the Authenticator instance for concatenation.
   * @example
   * authenticator.unuse("another").unuse("some");
   */
  unuse(name: string): Authenticator {
    this.#strategies.delete(name);
    return this;
  }

  /**
   * Call this to authenticate a request using some strategy. You pass the name
   * of the strategy you want to use and the request to authenticate.
   * The optional callback allows you to do something with the user object
   * before returning a new Response. In case it's not provided the strategy
   * will return a new Response and set the user to the session.
   * @example
   * let action: ActionFunction = async ({ request }) => {
   *   let user = await authenticator.authenticate("some", request);
   * };
   * @example
   * let action: ActionFunction = ({ request }) => {
   *   return authenticator.authenticate("some", request, {
   *     successRedirect: "/private",
   *     failureRedirect: "/login",
   *   });
   * };
   */
  async authenticate(props: AuthenticateProps): Promise<Response> {
    const { action, strategy, locals, ...event } = props;
    const instance = this.#strategies.get(strategy);

    if (!instance) {
      throw new ServerError({
        code: 'BadRequest',
        message: `The provided strategy: ${strategy} is not valid.`,
      });
    }

    const {user, redirect} = await instance.authenticate({
      ...event,
      locals,
      action,
      request: event.request.clone(),
      options: this.#options,
      baseUrl: this.baseUrl,
      session: locals.session,
    });

    // Store the user in the session.
    await locals.session.set('user', { ...user, strategy });

    return redirectResponse(
      redirect ?? instance.getRedirectUrl({ ...event, options: this.#options, baseUrl: this.baseUrl }),
    );
  }

  isAuthenticated(event: RequestEvent): boolean {
    return !!event.locals.session.data.user;
  }

  /**
   * Destroy the user session and return a redirect to another URL.
   */
  async logout(event: RequestEvent & { redirectTo: string | URL }): Promise<void> {
    const { session } = event.locals;

    await Promise.all([session.unset('user'), session.unset('authError')]);
  }
}
