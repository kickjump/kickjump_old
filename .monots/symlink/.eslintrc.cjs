const path = require('node:path');

function baseDir(...paths) {
  return path.join(__dirname, '../..', ...paths);
}

module.exports = {
  extends: ['monots'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['monots/full'],
      parserOptions: {
        project: [baseDir('./.monots/tsconfig.lint.json')],
      },
    },
    {
      files: ['*.tsx'],
      extends: ['monots/react'],
    },
    {
      files: [
        '**/vite.config.{js,ts}',
        'apps/_kickjump.com/**',
        'apps/kickjump.com/**',
        'tests/**',
      ],
      rules: { 'import/no-default-export': 'off' },
    },
    {
      files: ['apps/kickjump.com/**/*.js'],
      rules: { 'unicorn/prefer-module': 'off' },
    },
    {
      files: ['apps/kickjump.com/**'],
      rules: { 'unicorn/filename-case': ['error', { case: 'kebabCase', ignore: [/^\$.+\.tsx/i] }] },
    },
    // {
    //   files: ['apps/_kickjump.com/**'],
    //   extends: ['next/core-web-vitals', 'monots/react'],
    // },
    // {
    //   files: ['apps/kickjump.com/**'],
    //   extends: [
    //     '@remix-run/eslint-config',
    //     '@remix-run/eslint-config/node',
    //     '@remix-run/eslint-config/jest-testing-library',
    //   ],
    // },
  ],
};
