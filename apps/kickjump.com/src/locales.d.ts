type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type LiteralUnion<LiteralType, BaseType extends Primitive > = LiteralType | (BaseType & Record<never, never>);

declare module '$locales' {
  /** Registers all locales found in `localesRoot`. */
  export const registerAll: () => void

  /** A list of all locales that will be registered by {@link registerAll()}. */
  export const availableLocales: string[]
}

declare module '$locales/en-gb.js' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}

declare module '$locales' {
  /** Registers all locales found in `localesRoot`. */
  export const registerAll: () => void

  /** A list of all locales that will be registered by {@link registerAll()}. */
  export const availableLocales: string[]
}

declare module '$locales/en.js' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}

declare module '$locales' {
  /** Registers all locales found in `localesRoot`. */
  export const registerAll: () => void

  /** A list of all locales that will be registered by {@link registerAll()}. */
  export const availableLocales: string[]
}

declare module '$locales/es.js' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}

declare namespace App {
  type Locales = 'en' | 'en-GB' | 'es';

  interface LocaleMessages {
    home: never;
    projects: never;
    about: never;
    plain: never;
    interpolated: { val: Primitive };
    time: { now: Date | number };
    number: { n: number };
    pluralized: { count: number };
    'pluralized-with-hash': { count: number };
    selected: { gender: LiteralUnion<'male' | 'female', string> };
  }
}
