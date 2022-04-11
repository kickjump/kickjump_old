import { withEmotionCache } from '@emotion/react';
import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { useContext, useEffect, useRef } from 'react';

import { ClientStyleContext, ServerStyleContext } from '../utils/setup-emotion';
import { AppLayout } from './layout/main';
import { AppProvider } from './provider';

interface DocumentProps {
  children: React.ReactNode;
}
export const Document = withEmotionCache((props: DocumentProps, emotionCache) => {
  const { children } = props;
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);
  const firstRender = useRef(true);

  // Only executed on client
  useEffect(() => {
    firstRender.current = false;

    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();

    for (const tag of tags) {
      (emotionCache.sheet as any)._insertTag(tag);
    }

    // reset cache to reapply global styles
    clientStyleData?.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang='en' className='h-full w-full'>
      <head>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstaticom' />
        <link
          href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
          rel='stylesheet'
        />
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body className='h-full w-full'>
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
});
