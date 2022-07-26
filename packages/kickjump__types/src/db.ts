import type { CreatedAt, UpdatedAt } from '@kickjump/edgedb/types';
import type {
  ConditionalKeys,
  ConditionalPick,
  PartialDeep,
  Primitive,
  SetOptional,
  Simplify,
} from 'type-fest';

export type ExtractFields<Type> = {
  [Key in keyof Type]?:
    | true
    | (Type[Key] extends ArrayUnion<infer T extends WithId> ? ExtractFields<T> : never);
};

export function createTypeSafeFields<Type extends WithId>() {
  return <Shape extends ExtractFields<Type>>(shape: Shape): Simplify<Shape> => {
    return shape;
  };
}

export type TypeFromFields<Type extends WithId, Fields extends ExtractFields<Type>> = Simplify<{
  [Key in keyof Fields]: Key extends keyof Type
    ? Fields[Key] extends true
      ? Type[Key] extends WithId
        ? WithId
        : Type[Key] extends WithId[]
        ? WithId[]
        : Type[Key] extends string
        ? `${Type[Key]}`
        : Type[Key]
      : Type[Key] extends WithId
      ? Fields[Key] extends ExtractFields<Type[Key]>
        ? TypeFromFields<Type[Key], Fields[Key]>
        : never
      : Type[Key] extends Array<infer T extends WithId>
      ? Fields[Key] extends ExtractFields<T>
        ? Array<TypeFromFields<T, Fields[Key]>>
        : never
      : never
    : never;
}>;

export { AccountProvider, Status, Visibility } from '@kickjump/edgedb/types';

/**
 * Matches any primitive, `Date`, or `RegExp` value.
 */
type BuiltIns = Primitive | Date | RegExp;
type Native = BuiltIns | object;

export type DeepOmit<Type, Omitted extends string> = Type extends BuiltIns
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

export type UpdatedAtType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<UpdatedAt, '__type__'>,
  Options
>;
export type CreatedAtType<Options extends AvailableOptions = object> = Custom<
  DeepOmit<CreatedAt, '__type__'>,
  Options
>;
export type CreateOmitKeys = 'id' | 'createdAt' | 'updatedAt' | 'actions';
export type UpdateOmitKeys = 'createdAt' | 'updatedAt' | 'actions';

export interface AvailableOptions {
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
  /** Pick top level keys */
  pick?: string | undefined;
  /** Conditionally omit properties which extend the provided */
  conditionalOmit?: Native | undefined;
  /** Conditionally pick properties which extend the provided type */
  conditionalPick?: Native | undefined;
  /** Remove all flattened object types */
  simplify?: boolean | undefined;
  /** Only hold onto nested database objects */
  complexify?: boolean | undefined;
  /** Replace the matching keys */
  replace?: object | undefined;
}

export type Custom<Type, Options extends AvailableOptions> = Options extends { deepPartial: true }
  ? Custom<PartialDeep<Type>, Omit<Options, 'deepPartial'>>
  : Options extends { simplify: true }
  ? Custom<ConditionalOmit<Type, ArrayUnion<WithId>>, Omit<Options, 'simplify'>>
  : Options extends { complexify: true }
  ? Custom<ConditionalPick<Type, ArrayUnion<WithId>>, Omit<Options, 'complexify'>>
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
  : Options extends { pick: infer Keys extends keyof Type }
  ? Custom<Pick<Type, Keys>, Omit<Options, 'pick'>>
  : Options extends { conditionalOmit: infer Shape }
  ? Custom<ConditionalOmit<Type, Shape>, Omit<Options, 'conditionalOmit'>>
  : Options extends { conditionalPick: infer Shape }
  ? Custom<ConditionalPick<Type, Shape>, Omit<Options, 'conditionalPick'>>
  : Options extends { replace: infer Replacement extends object }
  ? Custom<Replace<Type, Replacement>, Omit<Options, 'replace'>>
  : Simplify<Type>;

type Replace<Type, Replacement extends object> = Omit<Type, keyof Replacement> & Replacement;
type ConditionalOmit<Base, Condition> = Omit<Base, ConditionalKeys<Base, Condition>>;

export interface WithId {
  id: string;
}
export type ArrayUnion<Type> = Type[] | Type;
export type EnumUnion<Type extends string> = Type | `${Type}`;
