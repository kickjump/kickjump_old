import { type Handle } from '@sveltejs/kit';
import {
  type Session as CookieSession,
  type SessionOptions,
  cookieSession,
} from 'svelte-kit-cookie-session';
import { type PrivateSession } from 'svelte-kit-cookie-session/dist/esm/types';
import type { LiteralUnion } from 'type-fest';

import { createCsrf } from './csrf';

type SessionData = Record<string, any> & { expires?: Date; __flash?: string[] };
type BaseSession = CookieSession<SessionData> & {
  flash: (key: string, value: unknown) => boolean;
};
type ServerSessionKeys = LiteralUnion<keyof App.Session, string>;

const createCookieSession = cookieSession as (
  headersOrCookieString: Headers | string,
  userOptions: SessionOptions,
) => {
  session: BaseSession & PrivateSession;
  cookies: Record<string, string>;
};

export interface ServerSession {
  /**
   * The raw data contained in this session.
   */
  readonly data: SessionData;

  /**
   * Returns `true` if the session has a value for the given `name`, `false`
   * otherwise.
   */
  has: (name: ServerSessionKeys) => boolean;

  /**
   * Returns the value for the given `name` in this session.
   */
  get: (name: ServerSessionKeys) => any;

  /**
   * Sets a value in the session for the given `name`.
   */
  set: (name: ServerSessionKeys, value: any) => ServerSession;

  /**
   * Sets a value in the session that is only valid until the next `get()`.
   * This can be useful for temporary values, like error messages.
   */
  flash: (name: ServerSessionKeys, value: any) => ServerSession;

  /**
   * Removes a value from the session.
   */
  unset: (name: ServerSessionKeys) => ServerSession;

  /**
   * Refresh the expiry date of the session.
   */
  refresh: (daysUntilExpiry?: number) => ServerSession;

  /**
   * Delete the session value
   */
  destroy: () => boolean;
}

/**
 * Attach the session to the request event.
 */
export function handleSession(
  options: SessionOptions,
  passedHandle: Handle = async ({ event, resolve }) => resolve(event),
): Handle {
  return async function handle({ event, resolve }) {
    const { session, cookies } = createCookieSession(event.request.headers, options);
    event.locals.session = createSessionMethods(session);
    event.locals.cookies = cookies;
    createCsrf(event);

    const response = await passedHandle({ event, resolve });

    if (!session['set-cookie']) {
      return response;
    }

    const sessionCookie = session['set-cookie'];
    response.headers.append('set-cookie', sessionCookie);

    return response;
  };
}

function createSessionMethods(session: BaseSession): ServerSession {
  const serverSession: ServerSession = {
    get data() {
      const { __flash, ...data } = session.data;
      return data;
    },

    has(name) {
      return !!session.data[name];
    },

    get(name) {
      const { __flash, ...data } = session.data;
      const flash = getFlash(__flash);

      if (flash.has(name)) {
        const value = data[name];
        flash.delete(name);
        session.data = { [name]: undefined, __flash: [...flash] };

        return value;
      }

      return data[name];
    },

    set(name, value) {
      const flash = getFlash(session.data.__flash);
      const data: BaseSession['data'] = { [name]: value };

      if (flash.has(name)) {
        flash.delete(name);
        data.__flash = [...flash];
      }

      session.data = data;

      return serverSession;
    },

    unset(name) {
      return serverSession.set(name, undefined);
    },

    flash(name, value) {
      const flash = getFlash(session.data.__flash);
      flash.add(name);
      session.data = { [name]: value, __flash: [...flash] };

      return serverSession;
    },

    refresh(daysUntilExpiry) {
      session.refresh(daysUntilExpiry);
      return serverSession;
    },

    destroy() {
      return session.destroy();
    },
  };

  return serverSession;
}

function getFlash(maybeFlash: string[] | undefined): Set<string> {
  return new Set(Array.isArray(maybeFlash) ? maybeFlash : []);
}

declare global {
  namespace App {
    interface Locals {
      /**
       * The session data and methods as inspired by `@remix/server-runtime`.
       */
      session: ServerSession;
      cookies: Record<string, string>;
    }
  }
}
