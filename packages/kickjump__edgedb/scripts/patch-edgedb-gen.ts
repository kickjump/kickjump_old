import { readFile, writeFile } from 'node:fs/promises';
const filename = new URL('../tmp/syntax/select.ts', import.meta.url).pathname;
const contents = await readFile(filename, { encoding: 'utf8' });

await writeFile(
  filename,
  contents.replace(
    '  Modifiers = Pick<Shape, SelectModifierNames>',
    '  Modifiers extends SelectModifiers = Pick<Shape, SelectModifierNames>',
  ),
);
