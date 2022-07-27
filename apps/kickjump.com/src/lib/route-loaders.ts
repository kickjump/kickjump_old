import type { Load, LoadOutput } from '@sveltejs/kit';
import { isFunction } from 'is-what';

export function authenticated(fn?: Load | LoadOutput): Load {
  return (event) => {
    const { session, url, props } = event;

    if (!session.user) {
      return { redirect: `/login?redirect=${url.pathname}`, status: 307 };
    }

    if (!fn || !isFunction(fn)) {
      return { props, ...fn };
    }

    return fn(event);
  };
}

export function notAuthenticated(fn?: Load | LoadOutput): Load {
  return (event) => {
    const { session, props, url } = event;

    if (session.user) {
      // const redirectUrl = new URL(params.redirect ?? '/', url);
      // redirectUrl.searchParams.set('redirect', url.href);
      // const redirect = redirectUrl.href;
      return { redirect: url.searchParams.get('redirect') ?? '/', status: 307 };
    }

    if (!fn || !isFunction(fn)) {
      return { props, ...fn };
    }

    return fn(event);
  };
}

export function loader(fn: Load | LoadOutput): Load {
  return (event) => (isFunction(fn) ? fn(event) : { props: event.props, ...fn });
}
