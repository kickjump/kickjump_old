const config = require('prettier-config-monots/svelte');
config.bracketSameLine;
module.exports = {
  ...config,
  plugins: [...config.plugins, require('prettier-plugin-tailwindcss')],
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'strict',
};
