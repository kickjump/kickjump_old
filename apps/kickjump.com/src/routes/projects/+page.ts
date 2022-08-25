import type { LoadEvent } from '@sveltejs/kit';

import { withPageLoad } from '$lib/route-loaders.js';

import type { LayoutData, RouteParams } from './$types';

export function load(event: LoadEvent<RouteParams, object, LayoutData>) {
  return withPageLoad({ seo: { title: 'Projects | KickJump' }, event, data: {} });
}
