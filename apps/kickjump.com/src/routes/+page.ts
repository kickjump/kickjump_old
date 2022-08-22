import { withSeo } from '$lib/route-loaders.js';

import type { PageLoadEvent } from './$types';

export function load(event: PageLoadEvent) {
  return withSeo({ seo: {}, event, data: {} });
}
