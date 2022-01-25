import type { DefaultSeoProps } from 'next-seo';

import { getUrl } from '~/utils/core';

export const DEFAULT_SEO: DefaultSeoProps = {
  title: 'KickJump',
  titleTemplate: '%s',
  description: 'Your toolkit for financially sustainable open source development.',
  additionalMetaTags: [
    { property: 'author', content: 'Ifiok Jr.' },
    {
      property: 'keywords',
      content: 'open source,solana,dao,nft,token',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@kickjumpco',
    site: 'kickjumpco',
  },
  openGraph: {
    type: 'website',
    url: getUrl(),
    site_name: 'KickJump',
    profile: {
      firstName: 'Ifiok Jr.',
    },
    images: [
      {
        url: getUrl(`/images/banner.png`),
        width: 2560,
        height: 1440,
        alt: 'KickJump - Your toolkit for financially sustainable open source development.',
      },
    ],
  },
};
