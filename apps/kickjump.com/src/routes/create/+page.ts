import { withPageLoad } from '$lib/route-loaders';

import type { PageLoadEvent } from './$types.js';

export async function load(event: PageLoadEvent) {
  return withPageLoad({ seo: { title: 'Create Project | KickJump' }, event, data: {} });
}
