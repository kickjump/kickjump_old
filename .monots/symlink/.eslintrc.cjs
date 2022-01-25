module.exports = {
  extends: ['monots'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['monots/full'],
      parserOptions: {
        project: ['./.monots/tsconfig.lint.json'],
      },
    },
    {
      files: ['*.tsx'],
      extends: ['monots/react'],
    },
    {
      files: ['**/vite.config.{js,ts}', 'websites/**'],
      rules: { 'import/no-default-export': 'off' },
    },
    {
      files: ['websites/kickjump.com/**'],
      extends: ['next/core-web-vitals', 'monots/react'],
    },
  ],
};
