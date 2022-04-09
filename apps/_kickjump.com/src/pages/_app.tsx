import '~/polyfill';

import { Provider } from '@kickjump/components';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import superjson from 'superjson';

import { type AppRouter } from '~/server/app-router';
import { getUrl } from '~/utils/core';
import { DEFAULT_SEO } from '~/utils/seo';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <Provider>
      <ThemeProvider attribute='class'>
        <Head>
          <meta charSet='utf8' />
          <meta name='viewport' content='width=device-width,initial-scale=1' />
        </Head>
        <DefaultSeo {...DEFAULT_SEO} />

        <SessionProvider session={pageProps.session}>
          <Toaster />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default withTRPC<AppRouter>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({ url: `${getUrl()}/api/trpc` }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,

  /**
   * Set headers or status code when doing SSR
   */
  responseMeta({ clientErrors }) {
    if (clientErrors.length > 0) {
      // propagate http first error from API calls
      return { status: clientErrors[0]?.data?.httpStatus ?? 500 };
    }

    // for app caching with SSR see https://trpc.io/docs/caching

    return {};
  },
})(App);
