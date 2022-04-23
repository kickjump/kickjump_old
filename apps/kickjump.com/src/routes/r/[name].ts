import { redirect } from '@kickjump/svelte-auth';
import type { RequestHandler } from '@sveltejs/kit';

import { REDIRECTS } from '$utils/constants';
import { getAbsoluteUrl } from '$utils/get-absolute-url';

export const get: RequestHandler = (event) => {
  const { pathname } = event.url;
  const { to, status = 302 } = REDIRECTS[pathname] ?? { to: '/' };

  const response = redirect(new URL(to, getAbsoluteUrl()), status);
  return response;
};
