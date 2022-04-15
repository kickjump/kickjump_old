import type { ActionFunction, LoaderFunction } from '@remix-run/node';

import { authenticator } from '~/utils/auth.server';

export const action: ActionFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: '/' });
};
