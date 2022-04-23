import is from '@sindresorhus/is';

import type { TupleRange } from '$types';

/**
 * Create a range from start to end.
 *
 * If only start is provided it creates an array of the size provided. if start
 * and end are provided it creates an array who's first position is start and
 * final position is end. i.e. `length = (end - start) + 1`.
 *
 * If you'd like to create a typed tuple of up to `40` items then pass in a
 * `[number]` tuple as the first argument.
 */
export function range<Size extends number>(size: [Size]): TupleRange<Size>;
export function range(size: number): number[];
export function range(start: number, end: number): number[];
export function range(start: number | [number], end?: number): number[] {
  const startValue = is.array(start) ? start[0] : start;

  if (!is.number(end)) {
    return Array.from(
      { length: Math.abs(startValue) },
      (_, index) => (startValue < 0 ? -1 : 1) * index,
    );
  }

  if (startValue <= end) {
    return Array.from({ length: end + 1 - startValue }, (_, index) => index + startValue);
  }

  return Array.from({ length: startValue + 1 - end }, (_, index) => -1 * index + startValue);
}
