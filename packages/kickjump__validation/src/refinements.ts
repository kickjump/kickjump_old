/**
 * Refinements used in zod.
 */
import * as z from 'zod';

export function slug(asyncCheck?: (value: string) => Promise<boolean>) {
  return z
    .string()
    .min(3)
    .max(20)
    .regex(/^[\w.-]+$/, { message: 'Should only include valid alphanumeric characters.' })
    .regex(/^[^._-]+/, { message: 'Please start with an alphanumeric character [a-z] or [0-9]' })
    .refine((value) => !/[._-]{2,}/.test(value), {
      message: "Special characters `-_.` shouldn't repeat.",
    })
    .refine((value) => asyncCheck?.(value) ?? true, {
      message: 'The requested name is not available.',
    })
    .transform((value) => value.toLocaleLowerCase());
}

export function setSlugAndTitle(asyncCheck?: (value: string) => Promise<boolean>) {
  return z.object({
    title: title(),
    slug: slug(asyncCheck),
  });
}

export function title() {
  return z.string().min(6).max(25);
}

export function description() {
  return z.string().min(50);
}

export function ids() {
  return z.array(z.string().uuid());
}

export function project() {
  return z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    slug: slug().optional(),
    description: description(),
    members: ids().optional(),
  });
}
