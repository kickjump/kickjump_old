import type { Load } from '@sveltejs/kit';

export function authenticated(fn?: Load): Load {
  return (event) => {
    const { session, url, props } = event;

    if (!session.user) {
      return {
        redirect: `/auth/login/github?redirect=${url.pathname}`,
        status: 307,
      };
    }

    if (!fn) {
      return {
        props,
      };
    }

    return fn(event);
  };
}

export function loader(fn: Load): Load {
  return (event) => {
    return fn(event);
  };
}
