import type { Page } from '@sveltejs/kit';
import type { Readable } from 'svelte/store';
import { get } from 'svelte/store';
import type { ValueOf } from 'type-fest';

interface ClientAuthenticatorProps {
  page: Readable<Page>;
  basePath?: string | undefined;
}

export class ClientAuthenticator {
  #url?: URI;

  readonly basePath: string;
  readonly page: Readable<Page>;

  get #origin(): string {
    return this.url.origin;
  }

  get url(): URI {
    return (this.#url ??= URI.of(get(this.page).url));
  }

  constructor(props: ClientAuthenticatorProps) {
    const { basePath = '/auth', page } = props;

    this.basePath = basePath;
    this.page = page;
  }

  /**
   * Will automatically redirect to the home route when method is `GET`.
   */
  async logout(csrf: string) {
    const headers = new Headers();
    headers.set(CSRF_HEADER_KEY, csrf);

    const response = await fetch(this.#getUrl('logout'), { method: 'POST', headers });
    const json: { redirectTo: string | undefined } = await response.json();

    return json.redirectTo;
  }

  logoutUrl() {
    return this.#getUrl('logout');
  }

  /**
   * Get the strategy url.
   */
  strategyUrl<Strategy extends keyof kj.ClientAuthenticatorUrls>(
    strategy: Strategy,
    action: ValueOf<kj.ClientAuthenticatorUrls[Strategy]>,
    params: {
      [param: string]: string | undefined;
      redirect?: string | undefined;
    } = {},
  ) {
    const uri = this.#getUrl(`${action}/${strategy}`);
    params = { redirect: `${this.url.pathname}${this.url.search}`, ...params };

    for (const [param, value] of Object.entries(params)) {
      if (value) {
        uri.searchParams.set(param, value);
      }
    }

    return uri;
  }

  #getUrl(endpoint: string) {
    return new URI(`${this.basePath}/${endpoint}`, this.#origin);
  }
}

export class URI extends URL {
  static of(url: URL | string, base?: URL | string | undefined): URI {
    return new this(url, base);
  }

  /**
   * The pathname including search parameters.
   *
   * ```ts
   * const url = new URI('https://awesome.com/path/to/destiny?you=have&arrived=now');
   * url.searchPath // => /path/to/destiny?you=have&arrived=now
   * ```
   */
  get searchPath(): string {
    return `${this.pathname}${this.search}`;
  }

  clone(): URI {
    return URI.of(this);
  }
}

export const CSRF_HEADER_KEY = 'x-csrf-token';

type LiteralString = Record<never, never> & string;

declare global {
  namespace kj {
    interface ClientAuthenticatorUrls {
      [key: LiteralString]: string[];
      example: ['action1', 'action2'];
    }
  }
}
