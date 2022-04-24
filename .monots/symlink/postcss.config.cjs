const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssImport = require('postcss-import');
const postcssNested = require('tailwindcss/nesting');
const postcssPresetEnv = require('postcss-preset-env');

const config = {
  plugins: [
    postcssNested(),
    tailwindcss(),
    postcssImport(),
    autoprefixer({ cascade: true }),
    postcssPresetEnv({ stage: 0, features: { 'nesting-rules': false } }),
  ],
};

module.exports = config;
