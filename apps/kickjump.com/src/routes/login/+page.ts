import { withSeo } from '$lib/route-loaders';

import type { PageLoadEvent } from './$types';

export async function load(event: PageLoadEvent) {
  return withSeo({ seo: { title: 'Login | KickJump' }, event, data: {} });
}
