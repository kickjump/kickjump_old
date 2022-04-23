export type Maybe<T> = T | null | undefined;

/**
 * Create a tuple of `Size` from the provided `Type`.
 */
export type TupleOf<Type, Size extends number> = Size extends Size
  ? number extends Size
    ? Type[]
    : _TupleOf<Type, Size, []>
  : never;
type _TupleOf<Type, Size extends number, Tuple extends unknown[]> = Tuple['length'] extends Size
  ? Tuple
  : _TupleOf<Type, Size, [Type, ...Tuple]>;

export type NumberTuple<Size extends number> = TupleOf<number, Size>;

/**
 * Extract the valid index union from a provided tuple.
 *
 * ```ts
 * import { IndexUnionFromTuple } from '$types';
 *
 * const tuple = ['a', 'b', 'c'];
 * type Index = IndexUnionFromTuple<typeof tuple> => 0 | 1 | 2
 * ```
 */
export type IndexUnionFromTuple<Tuple extends readonly unknown[]> = Tuple extends Tuple
  ? number extends Tuple['length']
    ? number
    : _IndexUnionFromTuple<[], Tuple['length']>
  : never;
type _IndexUnionFromTuple<
  Tuple extends readonly unknown[],
  Length extends number,
> = Tuple['length'] extends Length
  ? Tuple[number]
  : _IndexUnionFromTuple<[...Tuple, Tuple['length']], Length>;

export type TupleRange<Size extends number> = Size extends Size
  ? number extends Size
    ? number[]
    : _NumberRangeTuple<[], Size>
  : never;
type _NumberRangeTuple<
  Tuple extends readonly unknown[],
  Length extends number,
> = Tuple['length'] extends Length ? Tuple : _NumberRangeTuple<[...Tuple, Tuple['length']], Length>;
