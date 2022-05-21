import { redirect } from '@kickjump/svelte-auth';
import type { RequestHandler } from '@sveltejs/kit';

import { getAbsoluteUrl } from '$server/get-absolute-url';
import { REDIRECTS } from '$utils/constants';

export const get: RequestHandler = (event) => {
  const { pathname } = event.url;
  const { to, status = 302 } = REDIRECTS[pathname] ?? { to: '/' };

  const response = redirect(new URL(to, getAbsoluteUrl()), status);
  return response;
};
