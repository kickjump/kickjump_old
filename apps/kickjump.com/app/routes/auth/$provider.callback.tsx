import type { LoaderFunction } from '@remix-run/node';
import invariant from 'tiny-invariant';

import { authenticator } from '~/utils/auth.server';
import { addNextUrlToQuery } from '~/utils/core';
import { getNextUrlFromSession } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.provider, 'a valid provider is required');
  const successRedirect = await getNextUrlFromSession(request, '/dashboard');

  return authenticator.authenticate(params.provider, request, {
    successRedirect,
    failureRedirect: addNextUrlToQuery('/login', successRedirect),
  });
};
