import type { Project as RawProject } from '@kickjump/edgedb/types';
import { isFunction } from 'is-what';
import { objectEntries, objectFromEntries, objectKeys } from 'ts-extras';
import type { ConditionalKeys } from 'type-fest';
import { z } from 'zod';

import type { TypeFromFields, WithId } from '../db.js';
import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type EnumUnion,
  createTypeSafeFields,
} from '../db.js';
import { Status } from '../db.js';
import { Visibility } from '../db.js';
import { removeUndefined } from './utils.js';
import { minimumVisibility, VisibilityHierachy as VisibilityHierarchy } from './utils.js';

export type Type<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawProject, '__type__'>,
  Options
>;

export const createFields = createTypeSafeFields<Type>();
export const FIELDS = createFields({
  createdAt: true,
  creator: true,
  description: true,
  id: true,
  members: true,
  name: true,
  proposals: true,
  status: true,
  tags: true,
  updatedAt: true,
  visibility: true,
});
export type Project = TypeFromFields<Type, typeof FIELDS>;

export type Action =
  | `${'read' | 'update'}.${keyof Project}`
  | `${'create' | 'delete'}.${ConditionalKeys<Project, WithId[]>}`
  | 'read'
  | 'delete'
  | 'update.owner';

export type ExtractRead<Type extends string> = Type extends `read.${infer Action}` ? Action : never;
export type ReadAction = ExtractRead<Action>;

type PermissionGrantFn<Data> = (data: Data) => ReadonlyArray<EnumUnion<Visibility>> | readonly [];
type PermissionGrant<Data> =
  | PermissionGrantFn<Data>
  | ReadonlyArray<EnumUnion<Visibility>>
  | readonly [];

type ProjectPermissions = {
  [Key in Action]: PermissionGrant<EnumUnion<Visibility>>;
};

const permissionsTuple = [
  ['create.members', minimumVisibility(Visibility.admin)],
  ['create.proposals', minimumVisibility(Visibility.manager)],
  ['create.tags', minimumVisibility(Visibility.editor)],
  ['delete.members', minimumVisibility(Visibility.admin)],
  ['delete.proposals', minimumVisibility(Visibility.manager)],
  ['delete.tags', minimumVisibility(Visibility.editor)],
  ['delete', minimumVisibility(Visibility.owner)],
  ['read', minimumVisibility(Visibility.$public)],
  ['read.createdAt', minimumVisibility(Visibility.$public)],
  ['read.creator', minimumVisibility(Visibility.$public)],
  ['read.description', minimumVisibility(Visibility.$public)],
  ['read.id', minimumVisibility(Visibility.$public)],
  ['read.members', minimumVisibility(Visibility.$public)],
  ['read.name', minimumVisibility(Visibility.$public)],
  ['read.proposals', minimumVisibility(Visibility.$public)],
  ['read.status', minimumVisibility(Visibility.$public)],
  ['read.tags', minimumVisibility(Visibility.$public)],
  ['read.title', minimumVisibility(Visibility.$public)],
  ['read.updatedAt', minimumVisibility(Visibility.$public)],
  ['read.visibility', minimumVisibility(Visibility.$public)],
  ['update.createdAt', []],
  ['update.creator', []],
  ['update.description', minimumVisibility(Visibility.editor)],
  ['update.id', []],
  ['update.members', minimumVisibility(Visibility.admin)],
  ['update.name', minimumVisibility(Visibility.admin)],
  ['update.owner', minimumVisibility(Visibility.owner)],
  ['update.proposals', minimumVisibility(Visibility.manager)],
  ['update.status', minimumVisibility(Visibility.manager)],
  ['update.tags', minimumVisibility(Visibility.editor)],
  ['update.title', minimumVisibility(Visibility.manager)],
  ['update.updatedAt', []],
  ['update.visibility', minimumVisibility(Visibility.admin)],
] as const;

const projectPermissions: ProjectPermissions = objectFromEntries(permissionsTuple);
type MappedTupleEntry<Type> = Type extends readonly [infer Name, any] ? Name : never;
type MappedTuple<Tuple extends readonly [...(readonly any[])]> = {
  [Index in keyof Tuple]: MappedTupleEntry<Tuple[Index]>;
} & { length: Tuple['length'] };
const permissionNames: MappedTuple<typeof permissionsTuple> = permissionsTuple.map(
  (value) => value[0],
) as unknown as MappedTuple<typeof permissionsTuple>;

export function permissions() {
  return z.enum(permissionNames);
}

interface HasProjectPermissionsProps {
  action: Action;
  permissions?: string[] | undefined;
  visibility: EnumUnion<Visibility>;
}

export function actionsInUpdate(project: Partial<Project>): Action[] {
  const actions: Action[] = [];

  for (const field of objectKeys(removeUndefined(project))) {
    actions.push(`update.${field}`);
  }

  return actions;
}

/**
 * Get the visible project values available.
 */
export function read<P extends Project>(project: P, permissions: string[] = []): P | undefined {
  const fields = Object.create(null);

  if (!has({ action: 'read', permissions, visibility: project.visibility })) {
    // No permissions to read the project data.
    return;
  }

  for (const [field, value] of objectEntries(project)) {
    if (has({ action: `read.${field}` as Action, permissions, visibility: project.visibility })) {
      fields[field] = value;
    }
  }

  return fields;
}

export function has(props: HasProjectPermissionsProps): boolean {
  const { action, permissions = [], visibility } = props;
  const set = new Set([Visibility.$public, ...permissions]);
  const checkPermission = projectPermissions[action];
  const permissionArray = isFunction(checkPermission)
    ? checkPermission(visibility)
    : checkPermission;

  for (const permission of permissionArray) {
    if (permission === Visibility.$public) {
      return true;
    }

    if (set.has(action)) {
      return true;
    }

    const index = VisibilityHierarchy.indexOf(permission as Visibility);

    if (index <= 0) {
      continue;
    }

    for (const item of VisibilityHierarchy.slice(index)) {
      if (set.has(item)) {
        return true;
      }
    }
  }

  return false;
}

type Check = (value: string) => Promise<boolean>;

export function slug(check?: Check) {
  return z
    .string()
    .min(3)
    .max(20)
    .regex(/^[\w.-]+$/, { message: 'The slug should only include valid alphanumeric characters.' })
    .regex(/^[^._-]+/, { message: 'Please start with an alphanumeric character [a-z] or [0-9]' })
    .refine((value) => !/[._-]{2,}/.test(value), {
      message: "Special characters `-_.` shouldn't repeat.",
    })
    .refine((value) => check?.(value) ?? true, {
      message: 'The requested name is not available.',
    })
    .transform((value) => value.toLocaleLowerCase());
}

export function createSchema(check?: Check) {
  return z.object({
    name: slug(check),
    description: description(),
  });
}

export function title() {
  return z.string().min(2).max(25);
}

export function description() {
  return z.string().min(50, { message: 'The description must contain a least 50 characters.' });
}

export function ids() {
  return z.array(z.string().uuid());
}

export function updateSchema(check?: Check) {
  return z.object({
    id: z.string().uuid(),
    title: title().optional(),
    slug: slug(check).optional(),
    visibility: z.nativeEnum(Visibility).optional(),
    status: z.nativeEnum(Status).optional(),
    description: description().optional(),
  });
}
