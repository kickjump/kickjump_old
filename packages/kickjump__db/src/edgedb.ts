import {
  type Account,
  type CreatedAt,
  type Email,
  type Project,
  type Proposal,
  type UpdatedAt,
  type User,
} from '@kickjump/edgedb';
import { type Executor, createClient } from 'edgedb';
import type _ from 'edgedb/dist/client.js';
import type { PartialDeep, Primitive, SetOptional, Simplify } from 'type-fest';

export const client = createClient();

export function run<Runner extends { run: (cxn: Executor) => any }>(
  runner: Runner,
): ReturnType<Runner['run']> {
  return runner.run(client);
}

export {
  AccountProvider,
  default as e,
  ProjectPermission,
  ProjectStatus,
  ProposalPermission,
  ProposalStatus,
  Visibility,
} from '@kickjump/edgedb';

/**
Matches any primitive, `Date`, or `RegExp` value.
*/
type BuiltIns = Primitive | Date | RegExp;

type DeepOmit<Type, Omitted extends string> = Type extends BuiltIns
  ? Type
  : Type extends object
  ? Type extends Array<infer Item>
    ? Item[] extends Type
      ? Array<DeepOmit<Item, Omitted>>
      : DeepObjectOmit<Type, Omitted>
    : DeepObjectOmit<Type, Omitted>
  : Type;

type DeepObjectOmit<
  Type extends object,
  Omitted extends string,
  Keys extends Exclude<keyof Type, Omitted> = Exclude<keyof Type, Omitted>,
  PartialKeys extends Keys extends Keys
    ? undefined extends Type[Keys]
      ? Keys
      : never
    : never = Keys extends Keys ? (undefined extends Type[Keys] ? Keys : never) : never,
  RequiredKeys extends Exclude<Keys, PartialKeys> = Exclude<Keys, PartialKeys>,
> = {
  [Key in PartialKeys]?: DeepOmit<Type[Key], Omitted>;
} & {
  [Key in RequiredKeys]: DeepOmit<Type[Key], Omitted>;
};

type DeepOptionalKey<Type, Optional extends string> = Type extends BuiltIns
  ? Type
  : Type extends object
  ? Type extends Array<infer Item>
    ? Item[] extends Type
      ? Array<DeepOptionalKey<Item, Optional>>
      : DeepObjectOptionalKey<Type, Optional>
    : DeepObjectOptionalKey<Type, Optional>
  : Type;

type DeepObjectOptionalKey<
  Type,
  Optional extends string,
  Keys extends Optional extends keyof Type ? Optional : never = Optional extends keyof Type
    ? Optional
    : never,
  OtherKeys extends Exclude<keyof Type, Optional> = Exclude<keyof Type, Optional>,
  PartialKeys extends OtherKeys extends OtherKeys
    ? undefined extends Type[OtherKeys]
      ? OtherKeys
      : never
    : never = OtherKeys extends OtherKeys
    ? undefined extends Type[OtherKeys]
      ? OtherKeys
      : never
    : never,
  RequiredKeys extends Exclude<OtherKeys, PartialKeys> = Exclude<OtherKeys, PartialKeys>,
> = {
  [Key in Keys]?: DeepOptionalKey<Type[Key], Optional>;
} & {
  [Key in PartialKeys]?: DeepOptionalKey<Type[Key], Optional>;
} & {
  [Key in RequiredKeys]: DeepOptionalKey<Type[Key], Optional>;
};

export type UserType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<User, '__type__'>,
  Options
>;
export type AccountType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<Account, '__type__'>,
  Options
>;
export type EmailType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<Email, '__type__'>,
  Options
>;
export type UpdatedAtType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<UpdatedAt, '__type__'>,
  Options
>;
export type CreatedAtType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<CreatedAt, '__type__'>,
  Options
>;
export type ProjectType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<Project, '__type__'>,
  Options
>;
export type ProposalType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<Proposal, '__type__'>,
  Options
>;

interface AvailableOptions {
  /** Deep omit keys */
  deepOmit?: string | undefined;
  /** Make every property optional in a deeply nested way. */
  deepPartial?: true | undefined;
  /** The keys to make optional for every nested object (can be used with id) */
  deepOptional?: string | undefined;
  /** Set the top level object to optional */
  partial?: true | undefined;
  /** Set the specified top level keys to optional */
  optional?: string | undefined;
  /** Omit top level keys */
  omit?: string | undefined;
  /** Replace the matching keys */
  replace?: object | undefined;
}

/** */
type Custom<Type, Options extends AvailableOptions> = Options extends { deepPartial: true }
  ? Custom<PartialDeep<Type>, Omit<Options, 'deepPartial'>>
  : Options extends { deepOmit: infer Keys extends string }
  ? Custom<DeepOmit<Type, Keys>, Omit<Options, 'deepOmit'>>
  : Options extends { deepOptional: infer Keys extends string }
  ? Custom<DeepOptionalKey<Type, Keys>, Omit<Options, 'deepOptional'>>
  : Options extends { partial: true }
  ? Custom<Partial<Type>, Omit<Options, 'partial'>>
  : Options extends { optional: infer Keys extends string }
  ? Custom<SetOptional<Type, Keys extends keyof Type ? Keys : never>, Omit<Options, 'optional'>>
  : Options extends { omit: infer Keys extends string }
  ? Custom<Omit<Type, Keys>, Omit<Options, 'omit'>>
  : Options extends { replace: infer Replacement extends object }
  ? Custom<Replace<Type, Replacement>, Omit<Options, 'replace'>>
  : Simplify<Type>;

type Replace<Type, Replacement extends object> = Omit<Type, keyof Replacement> & Replacement;
