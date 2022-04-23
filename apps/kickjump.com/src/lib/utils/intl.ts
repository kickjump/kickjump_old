import {
  t as baseT,
  // time as baseTime,
  // date as baseDate,
  // number as baseNumber,
  // json as baseJson,
} from 'precompile-intl-runtime';
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

export { date, json, locale, locales, number } from 'precompile-intl-runtime';

export const t = baseT as Readable<MessageFormatter>;

interface BaseMessageObject {
  locale?: string;
  format?: string;
  default?: string;
}

interface MessageObject<Values extends object> extends BaseMessageObject {
  values: Values;
}

interface MessageFormatter {
  <Key extends keyof App.LocaleMessages>(
    ...args: object extends App.LocaleMessages[Key]
      ? [id: Key, options?: BaseMessageObject]
      : [id: Key, options: MessageObject<App.LocaleMessages[Key]>]
  ): string;
  <Key extends keyof App.LocaleMessages>(
    object: { id: Key } & object extends App.LocaleMessages[Key]
      ? BaseMessageObject
      : MessageObject<App.LocaleMessages[Key]>,
  ): string;
}

// type JsonGetter = (id: string, locale?: string) => any;
// type TimeFormatter = (
//   d: Date | number,
//   options?: IntlFormatterOptions<Intl.DateTimeFormatOptions>,
// ) => string;
// type DateFormatter = (
//   d: Date | number,
//   options?: IntlFormatterOptions<Intl.DateTimeFormatOptions>,
// ) => string;
// type NumberFormatter = (
//   d: number,
//   options?: IntlFormatterOptions<Intl.NumberFormatOptions>,
// ) => string;

// type MessageObject<Key extends keyof App.LocaleMessages> = BaseMessageObject & App.LocaleMessages[Key] extends never ? { values?: never } :{
//   values: App.LocaleMessages[Key];
// }

// type MessageObjectWithId<Key extends keyof App.LocaleMessages> = MessageObject<Key> & {
//   id: Key;
// }

// type MessageFormatter<Key extends keyof App.LocaleMessages> = App.LocaleMessages[Key] extends never
//   ? {
//       (id: Key, options?: BaseMessageObject): string;
//       (object: { id: Key } & BaseMessageObject): string;
//     }
//   : {
//       (id: Key, options?: MessageObject<App.LocaleMessages[Key]>): string;
//       (object: { id: Key } & MessageObject<App.LocaleMessages[Key]>): string;
//     };
