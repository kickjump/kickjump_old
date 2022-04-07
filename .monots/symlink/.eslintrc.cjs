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
      files: ['**/vite.config.{js,ts}', 'apps/kickjump.com/**', 'tests/**'],
      rules: { 'import/no-default-export': 'off' },
    },
    {
      files: ['apps/kickjump.com/**'],
      extends: ['next/core-web-vitals', 'monots/react'],
    },
  ],
};
