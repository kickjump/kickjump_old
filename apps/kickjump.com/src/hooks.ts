import { getSessionData, handleSession } from '@kickjump/svelte-auth';
import { createTRPCHandle } from '@kickjump/trpc';
import type { GetSession } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { authenticator } from '$server/auth';
import { env } from '$server/env';
import { getAbsoluteUrl } from '$server/get-absolute-url';

export const handle = handleSession(
  { secret: env.SESSION_SECRET },
  sequence(authenticator.handle, createTRPCHandle()),
);

export const getSession: GetSession = async (event) => {
  const session = await getSessionData(event);
  const languageHeader = event.request.headers.get('accept-language')?.split(';')[0] ?? '';
  const acceptedLanguages = languageHeader.split(',');
  const preferredLanguage = acceptedLanguages[0] ?? 'en';
  const error = event.locals.error;
  const userAgent = event.request.headers.get('user-agent') ?? '';
  const absoluteUrl = getAbsoluteUrl();
  console.log(session)

  return {
    ...session,
    error,
    acceptedLanguages,
    preferredLanguage,
    userAgent,
    absoluteUrl,
  };
};
