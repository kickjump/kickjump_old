import type { Page } from '@sveltejs/kit';
import type { Readable } from 'svelte/store';
import { get } from 'svelte/store';
import type { ValueOf } from 'type-fest';

interface ClientAuthenticatorProps {
  page: Readable<Page>;
  basePath?: string | undefined;
}

export class ClientAuthenticator {
  #url?: URL;

  readonly basePath: string;
  readonly page: Readable<Page>;

  get origin(): string {
    return this.url.origin;
  }

  get url(): URL {
    return (this.#url ??= get(this.page).url);
  }

  /**
   * @param [basePath] The path to the base authentication route.
   */
  constructor(props: ClientAuthenticatorProps) {
    const { basePath = '/auth', page } = props;

    this.basePath = basePath;
    this.page = page;
  }

  /**
   * Will automatically redirect to the home route when method is `GET`.
   */
  async logout(method: 'GET' | 'POST' = 'GET') {
    return await fetch(this.#getUrl('logout'), { method });
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
    const url = this.#getUrl(`${action}/${strategy}`);
    params = { redirect: `${this.url.pathname}${this.url.search}`, ...params };

    for (const [param, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(param, value);
      }
    }

    return url;
  }

  #getUrl(endpoint: string) {
    return new URL(`${this.basePath}/${endpoint}`, this.origin);
  }
}

type LiteralString = Record<never, never> & string;

declare global {
  namespace kj {
    interface ClientAuthenticatorUrls {
      [key: LiteralString]: string[];
      example: ['action1', 'action2'];
    }
  }
}
