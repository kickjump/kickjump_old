import cx from 'clsx';
import RandomNumberGenerator from 'tiny-rng';

import type { Maybe } from '$types';
import { range } from '$utils/helpers';

import type { ButtonVariant } from '../buttons/index.js';

export interface SketchOptions {
  /**
   * The number of iterations to run the sketch.
   * @default 2
   */
  iterations?: number;
  /**
   * The clamp around the available degrees of rotation for each iteration.
   *
   * @default `[0, 2]`
   */
  rotationClamp?: [number, number];

  /**
   * The degrees of rotation for each iteration.
   */
  rotations?: Array<Maybe<number>>;

  /**
   * The CSS class which applies the filter to each iteration.
   */
  filters?: Array<Maybe<typeof FILTER_CLASSES[number]>>;

  /**
   * The box shape classes, which use border radius to provide a custom shape
   * for each iteration.
   */
  shapes?: Array<Maybe<typeof SHAPE_CLASSES[number]>>;
}

export function generateSketchProps(
  seed: number,
  options: SketchOptions = {},
): Required<SketchOptions> {
  const generator = new RandomNumberGenerator(0, seed);
  const { iterations = 2, rotationClamp = [0, 2] } = options;

  const filters: Array<Maybe<typeof FILTER_CLASSES[number]>> = [];
  const shapes: Array<Maybe<typeof SHAPE_CLASSES[number]>> = [];
  const rotations: number[] = [];

  for (const _ of range(iterations + (iterations > 2 ? 2 : 1))) {
    // filters.push(FILTER_CLASSES[generator.random(0, FILTER_CLASSES.length)]);
    filters.push(FILTER_CLASSES[0]);
    shapes.push(SHAPE_CLASSES[generator.random(0, SHAPE_CLASSES.length - 1)]);
    rotations.push(generator.random(rotationClamp[0], rotationClamp[1]));
  }

  return {
    iterations,
    rotationClamp,
    rotations: options.rotations ?? rotations,
    filters: options.filters ?? filters,
    shapes: options.shapes ?? shapes,
  };
}

const SHAPE_CLASSES = [
  'rounded-paper1',
  'rounded-paper2',
  'rounded-paper3',
  'rounded-paper4',
  'rounded-paper5',
  'rounded-paper6',
] as const;
const FILTER_CLASSES = [
  // 'sketch-icon',
  'sketch-border',
  // 'sketch-background'
] as const;

export const BORDER_WIDTH = /*tw*/ {
  sm: 'border-1',
  md: 'border-2',
  lg: 'border-4',
};
export type BorderWidth = keyof typeof BORDER_WIDTH;

interface GenerateBorderClasses {
  seed: number;
  variant: ButtonVariant;
  width: BorderWidth;
}

export function generateBorderClasses({ seed, variant, width }: GenerateBorderClasses): string {
  const { shapes } = generateSketchProps(seed, { iterations: 1, filters: [], rotations: [] });

  return cx(
    shapes[0],
    variant === 'outline' && BORDER_WIDTH[width],
    ['outline', 'link'].includes(variant) && 'border-current',
    variant === 'link' && [
      'hover:underline',
      'active:underline',
      'underline-offset-4',
      'decoration-thickness-2',
    ],
  );
}
