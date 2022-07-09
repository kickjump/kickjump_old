import type { GetSession } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { auth } from '$server/auth';
import { env } from '$server/env';
import { getAbsoluteUrl } from '$server/get-absolute-url';
import { createContext, createTRPCHandle, router } from '$server/trpc';

export const handle = sequence(createTRPCHandle({ router, createContext }));

export const getSession: GetSession = async (event) => {
  const session = await auth.getSession(event);
  const languageHeader = event.request.headers.get('accept-language')?.split(';')[0] ?? '';
  const acceptedLanguages = languageHeader.split(','); //.map((lang) => lang.toLowerCase());
  const preferredLanguage = acceptedLanguages[0] ?? 'en';
  const error = event.locals.error;
  const userAgent = event.request.headers.get('user-agent') ?? '';
  const absoluteUrl = getAbsoluteUrl();

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
