import { withSeo } from '$lib/route-loaders.js';

import type { PageLoadEvent } from './$types';

export async function load(event: PageLoadEvent) {
  return withSeo({
    seo: { title: `${event.data.project.name} | Project` },
    event,
    data: event.data,
  });
}
