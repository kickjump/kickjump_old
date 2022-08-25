import { withPageLoad } from '$lib/route-loaders.js';

import type { PageLoadEvent } from './$types';

export async function load(event: PageLoadEvent) {
  return withPageLoad({
    seo: { title: `${event.data.project.name} | Project` },
    event,
    data: event.data,
  });
}
