import { withPageLoad } from '$lib/route-loaders.js';

import type { PageLoadEvent } from './$types.js';

export function load(event: PageLoadEvent) {
  return withPageLoad({ seo: {}, event, data: {} });
}
