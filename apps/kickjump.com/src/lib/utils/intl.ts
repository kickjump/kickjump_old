import {
  t as baseT,
  // time as baseTime,
  // date as baseDate,
  // number as baseNumber,
  // json as baseJson,
} from 'precompile-intl-runtime';
import type { Readable } from 'svelte/store';

export { locale, locales, date, number, json } from 'precompile-intl-runtime';

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
    ...args: {} extends App.LocaleMessages[Key]
      ? [id: Key, options?: BaseMessageObject]
      : [id: Key, options: MessageObject<App.LocaleMessages[Key]>]
  ): string;
  <Key extends keyof App.LocaleMessages>(
    object: { id: Key } & {} extends App.LocaleMessages[Key]
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
