/**
 * Refinements used in zod.
 */
import * as z from 'zod';

type SlugCheck = (value: string) => Promise<boolean>;

export function slug(check?: SlugCheck) {
  return z
    .string()
    .min(3)
    .max(20)
    .regex(/^[\w.-]+$/, { message: 'Should only include valid alphanumeric characters.' })
    .regex(/^[^._-]+/, { message: 'Please start with an alphanumeric character [a-z] or [0-9]' })
    .refine((value) => !/[._-]{2,}/.test(value), {
      message: "Special characters `-_.` shouldn't repeat.",
    })
    .refine((value) => check?.(value) ?? true, {
      message: 'The requested name is not available.',
    })
    .transform((value) => value.toLocaleLowerCase());
}

export function setSlugAndTitle(check?: SlugCheck) {
  return z.object({
    title: title(),
    slug: slug(check),
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

export function updateProject(check?: SlugCheck) {
  return z.object({
    id: z.string().uuid(),
    title: title().optional(),
    slug: slug(check).optional(),
    description: description(),
  });
}

export enum Permission {
  /** The ultimate role */
  Owner = 'owner',
  /** Can do everything except promote self to owner / or demote owner */
  Admin = 'admin',
  /** A preset role that can most things */
  Manager = 'manager',
  /** Mostly read access */
  Member = 'member',

  UpdateAll = 'update.all',
  DelateAll = 'delete.all',
  ReadAll = 'read.all',
  UpdateDescription = 'update.description',
}

export function permissions() {
  return z.array(z.nativeEnum(Permission));
}
