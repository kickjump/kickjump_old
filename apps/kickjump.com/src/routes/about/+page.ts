import { withSeo } from '$lib/route-loaders';

import type { PageLoadEvent } from './$types';

export async function load(event: PageLoadEvent) {
  return withSeo({ data: { animateTransition: true }, seo: { title: 'About | KickJump' }, event });
}
