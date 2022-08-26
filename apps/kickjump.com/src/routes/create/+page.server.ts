import { redirect } from '@sveltejs/kit';

import type { PageServerLoadEvent } from './$types.js';

export async function load(event: PageServerLoadEvent) {
  const { session } = await event.parent();

  if (!session.user?.id) {
    throw redirect(307, `/login?redirect=${event.url.pathname}`);
  }

  return event.parent();
}
