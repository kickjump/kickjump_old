/* eslint-disable unicorn/prefer-module */

const { createRequestHandler } = require('@remix-run/vercel');

module.exports = createRequestHandler({
  build: require('./_build'),
});
