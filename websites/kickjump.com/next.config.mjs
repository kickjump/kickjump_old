import withMonots from '@monots/next-plugin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    const resolve = (config.resolve ??= {});
    // resolve.enforceExtension = true;
    const fallback = (resolve.fallback ??= {});
    fallback.fs = false;
    fallback.buffer = require.resolve('poly-buffer');
    console.log('buffer', fallback.buffer);

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
