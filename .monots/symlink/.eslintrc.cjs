const path = require('node:path');

function baseDir(...paths) {
  return path.join(__dirname, '../..', ...paths);
}

// Don't run the full check in vscode or it becomes insanely slow.
const ESLINT_FULL_CHECK = !!process.env.ES_LINT_FULL_CHECK;

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['monots'],
  overrides: [
    {
      files: ['*.svelte'],
      plugins: ['import'],
      extends: ['monots/svelte'],
      globals: { svelte: true },
      rules: {
        'unicorn/prefer-export-from': 'off',
        'unicorn/no-useless-undefined': 'off',
        'import/no-duplicates': 'error',
        'import/no-cycle': 'error',
      },
    },
    {
      files: ['*.md'],
      extends: ['monots/markdown'],
    },
    {
      files: ['*.spec.ts'],
      // extends: ['monots/jest', 'monots/jest-dom', 'monots/testing-library'],
    },
    {
      files: ['packages/kickjump__query/src/**/*.ts'],
      rules: { '@typescript-eslint/naming-convention': 'off' },
    },
    {
      files: ['apps/kickjump.com/**/*.test.ts', 'tests/kickjump.com/*.test.ts'],
      extends: ['plugin:playwright/playwright-test'],
    },
  ],
  settings: {
    jest: { version: 28 },
    'svelte3/typescript': () => require('typescript'),
  },
};

if (ESLINT_FULL_CHECK) {
  config.overrides?.push({
    files: ['*.ts'],
    extends: ['monots/full'],
    parserOptions: {
      project: [baseDir('./.monots/tsconfig.lint.json')],
    },
    rules: {
      'import/no-default-export': 'off',
    },
  });
} else {
  config.extends.push('monots/full-off');
}

module.exports = config;
