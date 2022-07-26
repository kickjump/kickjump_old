import type { Load } from '@sveltejs/kit';

export function authenticated(fn?: Load): Load {
  return (event) => {
    const { session, url, props } = event;

    if (!session.user) {
      return { redirect: `/login?redirect=${url.pathname}`, status: 307 };
    }

    if (!fn) {
      return { props };
    }

    return fn(event);
  };
}

export function notAuthenticated(fn?: Load): Load {
  return (event) => {
    const { session, props, url } = event;

    if (session.user) {
      // const redirectUrl = new URL(params.redirect ?? '/', url);
      // redirectUrl.searchParams.set('redirect', url.href);
      // const redirect = redirectUrl.href;
      return { redirect: url.searchParams.get('redirect') ?? '/', status: 307 };
    }

    if (!fn) {
      return { props };
    }

    return fn(event);
  };
}

export function loader(fn: Load): Load {
  return (event) => {
    return fn(event);
  };
}
