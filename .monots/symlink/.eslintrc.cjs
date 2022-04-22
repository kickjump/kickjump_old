const path = require('node:path');

function baseDir(...paths) {
  return path.join(__dirname, '../..', ...paths);
}

module.exports = {
  extends: ['monots'],
  overrides: [
    {
      files: ['*.svelte'],
      extends: ['monots/svelte', 'monots/full'],
      parserOptions: {
        project: [baseDir('./.monots/tsconfig.lint.json')],
        extraFileExtensions: ['.svelte'],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['monots/full'],
      parserOptions: {
        project: [baseDir('./.monots/tsconfig.lint.json')],
      },
    },
  ],
};
