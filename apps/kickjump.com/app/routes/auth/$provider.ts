import { type ActionFunction, type LoaderFunction, redirect } from '@remix-run/node';
import { verifyAuthenticityToken } from 'remix-utils';
import invariant from 'tiny-invariant';

import { authenticator } from '~/utils/auth.server';
import { addNextUrlToSession, getSession } from '~/utils/session.server';

export const loader: LoaderFunction = () => redirect('/login');

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.provider, 'A valid provider is required.');

  // Verify the `csrf` token is valid.
  await verifyAuthenticityToken(request, await getSession(request));

  // This will add the nextUrl.
  await addNextUrlToSession(request);

  return authenticator.authenticate(params.provider, request);
};
