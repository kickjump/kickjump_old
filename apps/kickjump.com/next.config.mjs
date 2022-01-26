import withMonots from '@monots/next-plugin';
import { createRequire } from 'module';
import analyzer from '@next/bundle-analyzer';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  webpack: (config) => {
    // Nullish coalescing assignment is not supported on node 14 (vercel)
    // const resolve = (config.resolve ??= {});
    // const fallback = (resolve.fallback ??= {});

    const resolve = config.resolve ?? (config.resolve = {});
    const fallback = resolve.fallback ?? (resolve.fallback = {});

    fallback.fs = false;
    fallback['react-icons'] = false;
    fallback['@chakra-ui/react'] = false;
    fallback.buffer = require.resolve('poly-buffer');

    return config;
  },
};
const withBundleAnalyzer = analyzer({ enabled: process.env.ANALYZE === 'true' });

export default withBundleAnalyzer(withMonots(config));
