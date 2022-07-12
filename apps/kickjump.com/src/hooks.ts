import { getSession as getCookieSession, handleSession } from '@kickjump/svelte-auth';
import type { GetSession } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$server/env';
import { getAbsoluteUrl } from '$server/get-absolute-url';
import { createTRPCHandle } from '$server/trpc';
// import { createContext, createTRPCHandle, router } from '$server/trpc';

export const handle = handleSession({ secret: env.SESSION_SECRET }, sequence(createTRPCHandle()));

export const getSession: GetSession = async (event) => {
  const session = getCookieSession(event);
  const languageHeader = event.request.headers.get('accept-language')?.split(';')[0] ?? '';
  const acceptedLanguages = languageHeader.split(',');
  const preferredLanguage = acceptedLanguages[0] ?? 'en';
  const error = event.locals.error;
  const userAgent = event.request.headers.get('user-agent') ?? '';
  const absoluteUrl = getAbsoluteUrl();
  console.log(session);

  return {
    ...session,
    error,
    acceptedLanguages,
    preferredLanguage,
    userAgent,
    absoluteUrl,
    env: { PUBLIC_WEB3_AUTH_CLIENT_ID: env.PUBLIC_WEB3_AUTH_CLIENT_ID },
  };
};
