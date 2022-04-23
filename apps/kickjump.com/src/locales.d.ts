type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type LiteralUnion<LiteralType, BaseType extends Primitive > = LiteralType | (BaseType & Record<never, never>);

declare module '$locales/en-gb.js' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}

declare module '$locales/en.js' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}

declare module '$locales/es.js' {
  import { DeepDictionary } from 'precompile-intl-runtime/dist/modules/types';

  const localeData: DeepDictionary;
  export default localeData;
}

declare namespace App {
  interface LocaleMessages {
    home: {};
    projects: {};
    about: {};
    plain: {};
    interpolated: { val: Primitive };
    time: { now: Date | number };
    number: { n: number };
    pluralized: { count: number };
    'pluralized-with-hash': { count: number };
    selected: { gender: LiteralUnion<'male' | 'female', string> };
  }
}
