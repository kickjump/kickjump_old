import type { LoadEvent } from '@sveltejs/kit';

import { withSeo } from '$lib/route-loaders.js';

import type { LayoutData, RouteParams } from './$types';

export function load(event: LoadEvent<RouteParams, object, LayoutData>) {
  return withSeo({ seo: { title: 'Projects | KickJump' }, event });
}
