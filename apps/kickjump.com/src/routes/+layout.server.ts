import { getSessionData } from '@kickjump/svelte-auth';
import type { ServerLoadEvent } from '@sveltejs/kit';

import { DEFAULT_DEHYDRATED_STATE, DEFAULT_SEO } from '$lib/constants.js';
import { getAbsoluteUrl } from '$server/get-absolute-url';

import type { LayoutParams } from './$types';

export async function load(event: ServerLoadEvent<LayoutParams>) {
  const session = await getSessionData(event);
  const languageHeader = event.request.headers.get('accept-language')?.split(';')[0] ?? '';
  const acceptedLanguages = languageHeader.split(',');
  const preferredLanguage = acceptedLanguages[0] ?? 'en';
  const error = event.locals.error;
  const userAgent = event.request.headers.get('user-agent') ?? '';
  const absoluteUrl = getAbsoluteUrl();
  const extra = { error, acceptedLanguages, preferredLanguage, userAgent, absoluteUrl };

  return {
    session: { ...session, ...extra },
    dehydratedState: DEFAULT_DEHYDRATED_STATE,
    seo: DEFAULT_SEO,
    animateTransition: false,
  };
}
