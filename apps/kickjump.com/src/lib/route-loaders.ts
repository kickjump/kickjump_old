import type { DehydratedState } from '@kickjump/query';
import { type LoadEvent, type ServerLoadEvent, redirect } from '@sveltejs/kit';

import type { SeoProps } from '$components/seo';

import type { LayoutData } from '../routes/$types.js';

export function authenticated(url: URL, session: App.Session) {
  if (!session?.user) {
    throw redirect(307, `/login?redirect=${url.pathname}`);
  }
}

export function notAuthenticated(url: URL, session: App.Session) {
  if (session?.user?.id) {
    throw redirect(307, url.searchParams.get('redirect') ?? '/');
  }
}

type BasePageLoadEvent = LoadEvent<object, object | null, LayoutData>;
type BaseLoadEventServer = ServerLoadEvent<object, LayoutData>;

interface WithPageLoad<Data extends object, Event extends BasePageLoadEvent = BasePageLoadEvent>
  extends Partial<BaseProps> {
  event: Event;
  data?: Data;
}

export async function withPageLoad<
  Data extends object,
  Event extends BasePageLoadEvent = BasePageLoadEvent,
>(props: WithPageLoad<Data, Event>): Promise<Data & BaseProps> {
  const { seo, data, event, dehydratedState } = props;
  const parent = await event.parent();

  return { ...data, dehydratedState, seo: { ...parent.seo, ...seo } } as Data & BaseProps;
}

interface WithPageServerLoad<
  Data extends object,
  Event extends BaseLoadEventServer = BaseLoadEventServer,
> extends Partial<BaseProps> {
  event: Event;

  data?: Data | undefined;
}

export async function withPageServerLoad<
  Data extends object,
  Event extends BaseLoadEventServer = BaseLoadEventServer,
>(props: WithPageServerLoad<Data, Event>): Promise<Data & BaseProps> {
  const { seo, data, event, dehydratedState } = props;
  const parent = await event.parent();

  return { ...data, dehydratedState, seo: { ...parent.seo, ...seo } } as Data & BaseProps;
}

interface BaseProps {
  seo: SeoProps;
  dehydratedState: DehydratedState;
}
