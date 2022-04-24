import { json as baseJson, t as baseT } from 'precompile-intl-runtime';
import type { Readable } from 'svelte/store';

import { browser } from '$app/env';

/**
 * @see https://lingohub.com/academy/best-practices/rtl-language-list
 */
const RTL_CODES = [
  'ar', //	Arabic
  'arc', //	Aramaic
  'dv', //	Divehi
  'fa', //	Persian
  'ha', //	Hausa
  'he', //	Hebrew
  'khw', //	Khowar
  'ks', //	Kashmiri
  'ku', //	Kurdish
  'ps', //	Pashto
  'ur', //	Urdu
  'yi', //	Yiddish
];

/**
 * Get the direction for the provided county code.
 */
export function getDirFromCountryCode(countryCode: string) {
  return RTL_CODES.some((code) => countryCode.startsWith(code)) ? 'rtl' : 'ltr';
}

export function getLocaleFromNavigator(ssrDefault?: string) {
  if (!browser) {
    return ssrDefault || null;
  }

  return window.navigator.language || window.navigator.languages[0];
}

export { date, locale, locales, number } from 'precompile-intl-runtime';

export const t = baseT as Readable<MessageFormatter>;
export const json = baseJson as Readable<JsonGetter>;

interface BaseMessageObject {
  locale?: string;
  format?: string;
  default?: string;
}

interface MessageObject<Values extends object> extends BaseMessageObject {
  values: Values;
}

interface IdBaseMessageObject<Key extends string> extends BaseMessageObject {
  id: Key;
}

interface IdMessageObject<Key extends string, Values extends object> extends BaseMessageObject {
  id: Key;
  values: Values;
}

// interface MessageFormatter {
//   <
//     Key extends keyof App.LocaleMessages,
//   >(
//     value: App.LocaleMessages[Key] extends never
//     ? IdBaseMessageObject<Key>
//     : IdMessageObject<Key, App.LocaleMessages[Key]>,
//   ): string;
//   <Key extends keyof App.LocaleMessages>(
//     ...args: App.LocaleMessages[Key] extends never
//       ? [id: Key, options?: BaseMessageObject]
//       : [id: Key, options: MessageObject<App.LocaleMessages[Key]>]
//   ): string;
// }

type MessageFormatter = <Key extends keyof App.LocaleMessages>(
  ...args: App.LocaleMessages[Key] extends never
    ? [id: Key, options?: BaseMessageObject]
    : [id: Key, options: MessageObject<App.LocaleMessages[Key]>]
) => string;

type JsonGetter = (id: keyof App.LocaleMessages, locale?: LiteralUnion<App.Locales, string>) => any;
