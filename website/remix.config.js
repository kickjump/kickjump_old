/* eslint-disable unicorn/prefer-module */

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'api/_build',
  ignoredRouteFiles: ['.*'],
  devServerPort: process.env.TEST === '1' ? 8003 : 8002,
};
