import { withPageLoad } from '$lib/route-loaders';

import type { PageLoadEvent } from './$types.js';

export async function load(event: PageLoadEvent) {
  return withPageLoad({
    data: { animateTransition: true },
    seo: { title: 'About | KickJump' },
    event,
  });
}
