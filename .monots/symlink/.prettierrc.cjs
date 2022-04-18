const config = require('prettier-config-monots/svelte');
config.bracketSameLine;
module.exports = {
  ...config,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'strict',
};
