const path = require('node:path');

function baseDir(...paths) {
  return path.join(__dirname, '../..', ...paths);
}
/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['monots'],
  overrides: [
    {
      files: ['*.svelte'],
      extends: ['monots/svelte'],
      globals: { svelte: true },
    },
    {
      files: ['*.ts'],
      extends: ['monots/full'],
      parserOptions: {
        project: [baseDir('./.monots/tsconfig.lint.json')],
      },
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['*.md'],
      extends: ['monots/markdown'],
    },
    {
      files: ['*.spec.ts'],
      extends: ['monots/jest', 'monots/jest-dom', 'monots/testing-library'],
    },
  ],
  settings: {
    jest: { version: 28 },
    'svelte3/typescript': () => require('typescript'),
  },
};

module.exports = config;
