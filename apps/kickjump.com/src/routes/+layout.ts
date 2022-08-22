import type { LoadEvent } from '@sveltejs/kit';

import { DEFAULT_SEO } from '$lib/constants';

import type { LayoutServerData } from './$types';

export function load(_event: LoadEvent<object, LayoutServerData>) {
  return { seo: DEFAULT_SEO, animateTransition: false, ..._event.data };
}
