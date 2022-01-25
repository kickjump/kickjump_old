import withMonots from '@monots/next-plugin';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // experimental: { concurrentFeatures: true, serverComponents: true },
  // images: { formats: ['image/avif', 'image/webp'] },
  webpack: (config, { isServer }) => {
    const resolve = (config.resolve ??= {});
    // resolve.enforceExtension = true;

    if (isServer) {
      resolve.extensions = ['.node.ts', '.node.tsx', '.node.js', ...resolve.extensions];
      // config.externals = config.externals ?? [];
      // // config.externals._http_common = '_http_common';
      // config.externals.push('_http_common');
    } else {
      resolve.extensions = ['.browser.ts', '.browser.tsx', '.browser.js', ...resolve.extensions];
    }

    return config;
  },
};

export default withMonots(config);
