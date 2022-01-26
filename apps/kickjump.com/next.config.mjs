import withMonots from '@monots/next-plugin';
import { createRequire } from 'module';
import analyzer from '@next/bundle-analyzer';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  webpack: (config) => {
    const resolve = (config.resolve ??= {});
    const fallback = (resolve.fallback ??= {});
    fallback.fs = false;
    fallback['react-icons'] = false;
    fallback['@chakra-ui/react'] = false;
    fallback.buffer = require.resolve('poly-buffer');

    return config;
  },
};
const withBundleAnalyzer = analyzer({ enabled: process.env.ANALYZE === 'true' });

export default withBundleAnalyzer(withMonots(config));
