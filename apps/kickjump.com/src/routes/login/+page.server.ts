import { notAuthenticated } from '$lib/route-loaders.js';

import type { PageServerLoadEvent } from './$types.js';

export async function load(event: PageServerLoadEvent) {
  const parent = await event.parent();
  notAuthenticated(event.url, parent.session);

  return parent;
}
