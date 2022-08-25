import { withPageLoad } from '$lib/route-loaders';

import type { PageLoadEvent } from './$types';

export async function load(event: PageLoadEvent) {
  return withPageLoad({ seo: { title: 'Login | KickJump' }, event, data: {} });
}
