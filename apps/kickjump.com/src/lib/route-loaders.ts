import { type LoadEvent, redirect } from '@sveltejs/kit';

import type { SeoProps } from '$components/seo';

import type { LayoutData } from '../routes/$types.js';

export function authenticated(url: URL, session: App.Session) {
  if (!session?.user) {
    console.log('redirecting');
    throw redirect(307, `/login?redirect=${url.pathname}`);
  }
}

export function notAuthenticated(url: URL, session: App.Session) {
  if (session?.user?.id) {
    throw redirect(307, url.searchParams.get('redirect') ?? '/');
  }
}

type BaseLoadEvent = LoadEvent<object, object | null, LayoutData>;

interface WithSeoProps<Data extends object, Event extends BaseLoadEvent = BaseLoadEvent> {
  seo: SeoProps;
  event: Event;
  data: Data;
}

export async function withSeo<Data extends object, Event extends BaseLoadEvent = BaseLoadEvent>(
  props: WithSeoProps<Data, Event>,
) {
  const { seo, data, event } = props;
  const parent = await event.parent();

  return { seo: { ...parent.seo, ...seo }, ...data };
}
