/* eslint-disable @typescript-eslint/method-signature-style */
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { parse, stringify } from 'superjson';
import {
  type Session as CookieSession,
  type SessionOptions,
  cookieSession,
} from 'svelte-kit-cookie-session';
import type { PrivateSession } from 'svelte-kit-cookie-session/types';
import invariant from 'tiny-invariant';

import { createCsrf } from './csrf.js';

type LiteralString = Record<never, never> & string;
interface RawSessionData {
  expires?: Date;
  /**
   * @default { __flash: [] }
   */
  __raw?: string;
}

type ExcludeStartsWith<Union, Match extends string> = Union extends `${Match}${infer _Ignore}`
  ? never
  : Union;

export type PublicSessionData = Pick<SessionData, ExcludeStartsWith<keyof SessionData, '__'>>;

const DEFAULT_RAW_SESSION_DATA: SessionData = { __flash: [], csrf: '' } as unknown as SessionData;

interface SessionData extends App.Session {
  [key: LiteralString]: unknown;
  __flash: string[];
}

type BaseSession = CookieSession<RawSessionData>;
type ServerSessionKeys = keyof SessionData;

const createCookieSession = cookieSession as (
  headersOrCookieString: Headers | string,
  userOptions: SessionOptions,
) => Promise<{
  session: BaseSession & PrivateSession;
  cookies: Record<string, string>;
}>;

export interface ServerSession {
  /**
   * The raw data contained in this session.
   *
   * Use the `get` method instead since that works better with `flash()`.
   */
  readonly data: PublicSessionData;

  /**
   * Returns `true` if the session has a value for the given `name`, `false`
   * otherwise.
   */
  has: (name: ServerSessionKeys) => boolean;

  /**
   * Returns the value for the given `name` in this session.
   */
  get: <Key extends keyof SessionData>(name: Key) => SessionData[Key];

  /**
   * Sets a value in the session for the given `name`.
   */
  set<Key extends keyof SessionData>(
    name: ExcludeStartsWith<Key, '__'>,
    value: SessionData[Key],
  ): Promise<void>;
  setAll(values: Partial<SessionData>): Promise<void>;

  /**
   * Sets a value in the session that is only valid until the next `get()`.
   * This can be useful for temporary values, like error messages.
   */
  flash<Key extends keyof SessionData>(
    name: ExcludeStartsWith<Key, '__'>,
    value: SessionData[Key],
  ): Promise<void>;

  /**
   * Removes a value from the session.
   */
  unset(name: ServerSessionKeys): Promise<void>;
  unset(names: ServerSessionKeys[]): Promise<void>;

  /**
   * Refresh the expiry date of the session.
   */
  refresh(daysUntilExpiry?: number): Promise<void>;

  /**
   * Delete the whole session
   */
  destroy(): Promise<void>;
}

/**
 * Attach the session to the request event.
 *
 * This should be used in the `hooks.ts` file.
 *
 * ```ts
 * import { handleSession } from '@kickjump/svelte-auth';
 *
 * export const handle = handleSession(
 *   { secret: env.SESSION_SECRET },
 *   sequence(createTRPCHandle())
 * );
 * ```
 */
export function handleSession(
  options: SessionOptions,
  passedHandle: Handle = async ({ event, resolve }) => resolve(event),
): Handle {
  const secret = Array.isArray(options.secret) ? options.secret[0]?.secret : options.secret;
  invariant(secret, 'Must provide a valid secret key');

  return async function handle({ event, resolve }) {
    const { session, cookies } = await createCookieSession(event.request.headers, options);
    Object.defineProperties(event.locals, {
      session: { writable: false, enumerable: false, value: createSessionMethods(session) },
      cookies: { get: () => cookies },
    });

    // Ensure there is a csrf token before anything else runs.
    await createCsrf({ locals: event.locals, request: event.request, secret });

    const response = await passedHandle({ event, resolve });

    if (!session['set-cookie']) {
      return response;
    }

    const sessionCookie = session['set-cookie'];
    response.headers.append('set-cookie', sessionCookie);

    return response;
  };
}
/**
 * Get the session from the scope and simultaneously remove all flash values.
 *
 * `flash` values are only last for one server roundtrip and are removed here.
 *
 * You should use this in the sveltekit `hooks.ts` files.
 *
 * ```ts
 * import { getSessionData, handleSession } from '@kickjump/svelte-auth';
 *
 * export const getSession: GetSession = async (event) => {
 *   return await getSessionData(event);
 * }
 * ```
 */
export async function getSessionData(event: RequestEvent): Promise<App.Session> {
  const { session } = event.locals;
  const data = { ...session.data };
  const flash = session.get('__flash');
  await session.unset(flash);

  return data;
}

function parseData(raw: string | undefined): SessionData {
  return raw ? parse(raw) : DEFAULT_RAW_SESSION_DATA;
}

function stringifyData(data: SessionData): string {
  return stringify(data);
}

function createSessionMethods(session: BaseSession): ServerSession {
  const serverSession: ServerSession = {
    get data() {
      const data = parseData(session.data.__raw);
      // Remove all private data from the session data which is exposed to the client.
      return Object.fromEntries(
        Object.entries(data).filter(([name]) => !name.startsWith('__')),
      ) as SessionData;
    },

    has(name) {
      return !!serverSession.data[name];
    },

    get(name) {
      const data = parseData(session.data.__raw);
      const value = data[name];

      return value;
    },

    async set(name, value) {
      await serverSession.setAll({ [name]: value });
    },

    async setAll(data) {
      await session.update((rawData) => {
        const allData = parseData(rawData.__raw);
        const flash = getFlash(allData.__flash);

        for (const name of Object.keys(data)) {
          if (flash.has(name)) {
            flash.delete(name);
          }
        }

        data.__flash = [...flash];

        rawData.__raw = stringifyData({ ...allData, ...data });
        return rawData;
      });
    },

    async unset(name) {
      const names = Array.isArray(name) ? name : [name];
      const values: Partial<SessionData> = Object.create(null);

      for (const name of names) {
        values[name] = undefined;
      }

      await serverSession.setAll(values);
    },

    async flash(name, value) {
      await session.update((rawData) => {
        const allData = parseData(rawData.__raw);
        const flash = getFlash(allData.__flash);
        flash.add(name);
        const data = { [name]: value, __flash: [...flash] };

        rawData.__raw = stringifyData({ ...allData, ...data });
        return rawData;
      });
    },

    async refresh(daysUntilExpiry) {
      await session.refresh(daysUntilExpiry);
    },

    async destroy() {
      await session.destroy();
      await session.set({ __raw: stringifyData(DEFAULT_RAW_SESSION_DATA) });
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
      readonly session: ServerSession;
      cookies: Record<string, string>;
    }
  }
}
