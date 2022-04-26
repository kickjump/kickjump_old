import type { LiteralUnion } from 'type-fest';

import type { Maybe } from '$types';

interface AddUrlParams {
  params: Partial<KnownUrlParams> & { [key: string]: string | undefined };
  href: string | URL;
}

export function addUrlParams({ params, href }: AddUrlParams): string {
  const url = typeof href === 'string' ? new URL(href) : new URL(href.href);

  for (const [key, value] of Object.entries(params)) {
    const params = url.searchParams;

    if (value == null) {
      params.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }

  return url.href;
}

/**
 * Get the URL parameters from a URL or href.
 */
export function getUrlParam(
  href: string | URL,
  key: LiteralUnion<keyof KnownUrlParams, string>,
): Maybe<string> {
  try {
    const url = typeof href === 'string' ? new URL(href) : href;
    return url.searchParams.get(key);
  } catch {
    return undefined;
  }
}

/**
 * A set of known URL parameters, with descriptions to help with intellisense.
 */
export interface KnownUrlParams {}
