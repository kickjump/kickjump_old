import { type RequestEvent, redirect } from '@sveltejs/kit';

import { REDIRECTS } from '$lib/constants';
import { getAbsoluteUrl } from '$server/get-absolute-url';

import type { RouteParams } from './$types.js';

export function GET(event: RequestEvent<RouteParams>) {
  const { name } = event.params;
  const { to, status = 302 } = REDIRECTS[`/r/${name}`] ?? { to: '/' };

  throw redirect(status, new URL(to, getAbsoluteUrl()).href);
}
