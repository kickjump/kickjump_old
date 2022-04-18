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
      parserOptions: { project: [baseDir('./.monots/tsconfig.lint.json')] },
    },
    { files: ['*.tsx'], extends: ['monots/react'] },
    { files: ['apps/kickjump.com/'], extends: ['monots/svelte'] },
  ],
};
