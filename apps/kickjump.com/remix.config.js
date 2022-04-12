/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  serverDependenciesToBundle: [
    '@kickjump/prisma',
    '@kickjump/db',
    '@kickjump/components',
    'lodash-es',
    'ts-extras',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-react',
    '@strata-foundation/react',
    '@strata-foundation/spl-utils',
    '@strata-foundation/spl-token-bonding',
    '@strata-foundation/spl-token-collective',
    'superstruct',
    '@solana/wallet-adapter-phantom',
    '@solana/wallet-adapter-glow',
    '@solana/wallet-adapter-base',
    '@solana/spl-token',
    '@solana/buffer-layout-utils',
  ],
};
