import { type ActionFunction, type LoaderFunction, redirect } from '@remix-run/node';
import { verifyAuthenticityToken } from 'remix-utils';

import { authenticator } from '~/utils/auth.server';
import { SOLANA_HASH_KEY } from '~/utils/constants';
import { addNextUrlToSession, getNextUrlFromSession, getSession } from '~/utils/session.server';

export const loader: LoaderFunction = () => redirect('/login');

export const action: ActionFunction = async ({ request, context }) => {
  const session = await getSession(request);
  const hash = session.get(SOLANA_HASH_KEY);
  const successRedirect = await getNextUrlFromSession(request, '/dashboard');

  // Verify the `csrf` token is valid.
  await verifyAuthenticityToken(request, session);

  return authenticator.authenticate('solana', request, {
    context: { ...context, hash },
    successRedirect,
  });
};
