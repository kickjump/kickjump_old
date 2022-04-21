import { type MessageFormatElement, parse } from '@formatjs/icu-messageformat-parser';
import { TYPE } from '@formatjs/icu-messageformat-parser/types';
import json from './locales/en.json';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve a path relative to the base directory.
 *
 * @param {string[]} paths
 */
export function baseDir(...paths: string[]) {
  return path.resolve(__dirname, ...paths);
}

const translationEntries: string[] = [];

for (const [name, value] of Object.entries(json)) {
  const messageFormat = parse(value);
  const valuesObject = generateValuesObject(messageFormat)
    .map(([key, type]) => `${key}: ${type}`)
    .join('; ');
  translationEntries.push(`${getSafeKey(name)}: ${valuesObject ? `{ ${valuesObject} }` : '{}'}`);
}

type ParseResult = Array<[key: string, value: string]>;

/**
 * @param {import('@formatjs/icu-messageformat-parser').MessageFormatElement[]} value
 *
 * @returns {object}
 */
function generateValuesObject(value: MessageFormatElement[]): ParseResult {
  const results: ParseResult = [];

  for (const element of value) {
    switch (element.type) {
      case TYPE.literal:
      case TYPE.tag:
      case TYPE.pound:
        continue;
      case TYPE.argument:
        results.push([getSafeKey(element.value), 'Primitive']);
        continue;

      case TYPE.number:
        results.push([getSafeKey(element.value), 'number']);
        continue;

      case TYPE.date:
        results.push([getSafeKey(element.value), 'Date | number']);
        continue;

      case TYPE.time:
        results.push([getSafeKey(element.value), 'Date | number']);
        continue;

      case TYPE.select: {
        const keys = Object.keys(element.options)
          .filter((key) => key !== 'other')
          .map((key) => `'${key}'`)
          .join(' | ');
        results.push([getSafeKey(element.value), `LiteralUnion<${keys}, string>`]);
        continue;
      }

      case TYPE.plural:
        results.push([getSafeKey(element.value), 'number']);
        continue;

      default:
        console.error('Unknown type', JSON.stringify(element, null, 2));
        continue;
    }
  }

  return results;
}

function getSafeKey(value: string) {
  return /^[a-z_][a-z_0-9]*$/i.test(value) ? value : `'${value}'`;
}

async function createLocaleModules() {
  const files = await readdir(baseDir('locales'));
  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => `$locales/${file.replace('.json', '.js')}`)
    .map((file) => createLocaleModule(file))
    .join('\n\n');
}

function createLocaleModule(name: string) {
  return `\
declare module '${name}' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}`;
}

const result = `\
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type LiteralUnion<LiteralType, BaseType extends Primitive > = LiteralType | (BaseType & Record<never, never>);

${await createLocaleModules()}

declare namespace App {
  interface LocaleMessages {
    ${translationEntries.join(';\n    ')};
  }
}
`;

await writeFile(baseDir('src/locales.d.ts'), result);
