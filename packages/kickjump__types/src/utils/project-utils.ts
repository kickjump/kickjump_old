import type { Project as RawProject } from '@kickjump/edgedb/types';
import { isFunction } from 'is-what';
import { objectEntries, objectKeys } from 'ts-extras';
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
  | 'update'
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

const projectPermissions: ProjectPermissions = {
  'create.members': minimumVisibility(Visibility.admin),
  'create.proposals': minimumVisibility(Visibility.manager),
  'create.tags': minimumVisibility(Visibility.editor),
  'delete.members': minimumVisibility(Visibility.admin),
  'delete.proposals': minimumVisibility(Visibility.manager),
  'delete.tags': minimumVisibility(Visibility.editor),
  delete: minimumVisibility(Visibility.owner),
  read: minimumVisibility(Visibility.$public),
  'read.createdAt': minimumVisibility(Visibility.$public),
  'read.creator': minimumVisibility(Visibility.$public),
  'read.description': minimumVisibility(Visibility.$public),
  'read.id': minimumVisibility(Visibility.$public),
  'read.members': minimumVisibility(Visibility.$public),
  'read.name': minimumVisibility(Visibility.$public),
  'read.proposals': minimumVisibility(Visibility.$public),
  'read.status': minimumVisibility(Visibility.$public),
  'read.tags': minimumVisibility(Visibility.$public),
  'read.updatedAt': minimumVisibility(Visibility.$public),
  'read.visibility': minimumVisibility(Visibility.$public),
  update: minimumVisibility(Visibility.editor),
  'update.createdAt': [],
  'update.creator': [],
  'update.description': minimumVisibility(Visibility.editor),
  'update.id': [],
  'update.members': minimumVisibility(Visibility.admin),
  'update.name': minimumVisibility(Visibility.admin),
  'update.owner': minimumVisibility(Visibility.owner),
  'update.proposals': minimumVisibility(Visibility.manager),
  'update.status': minimumVisibility(Visibility.manager),
  'update.tags': minimumVisibility(Visibility.editor),
  'update.updatedAt': [],
  'update.visibility': minimumVisibility(Visibility.admin),
};

// type MappedTupleEntry<Type> = Type extends readonly [infer Name, any] ? Name : never;
// type MappedTuple<Tuple extends readonly [...(readonly any[])]> = {
//   [Index in keyof Tuple]: MappedTupleEntry<Tuple[Index]>;
// } & { length: Tuple['length'] };
// const permissionNames: MappedTuple<typeof permissionsTuple> = permissionsTuple.map(
//   (value) => value[0],
// ) as unknown as MappedTuple<typeof permissionsTuple>;
const permissionNames = objectKeys(projectPermissions) as [Action, ...Action[]];

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
export function readPermissions<P extends Project>(
  project: P,
  permissions: string[] = [],
): P | undefined {
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

export function name(check?: Check) {
  return z
    .string()
    .min(3)
    .max(20)
    .regex(/^[\w.-]+$/, { message: 'The name should only include valid alphanumeric characters.' })
    .regex(/^[^._-]+/, { message: 'Please start with an alphanumeric character [a-z] or [0-9]' })
    .refine((value) => !/[._-]{2,}/.test(value), {
      message: "Special characters `-_.` shouldn't repeat.",
    })
    .refine((value) => check?.(value) ?? true, {
      message: 'The requested name is not available.',
    })
    .transform((value) => value.toLocaleLowerCase());
}

interface CreateSchemaProps {
  name?: Check;
  tags?: Check;
}

export function createSchema({ name: nameCheck, tags: tagCheck }: CreateSchemaProps = {}) {
  return z.object({
    name: name(nameCheck),
    description: description(),
    tags: tags(tagCheck).optional(),
    visibility: z.nativeEnum(Visibility).optional(),
    status: z.nativeEnum(Status).optional(),
  });
}

export function title() {
  return z.string().min(2).max(25);
}

export function description() {
  return z.string().min(20, { message: 'The description must contain a least 20 characters.' });
}

export function ids() {
  return z.array(z.string().uuid());
}

export function updateSchema(checks?: { name?: Check | undefined; tag?: Check | undefined }) {
  return z
    .object({
      id: z.string().uuid(),
      name: name(checks?.name).optional(),
      visibility: z.nativeEnum(Visibility).optional(),
      status: z.nativeEnum(Status).optional(),
      description: description().optional(),
      tags: updateTags(checks?.tag).optional(),
    })
    .strict();
}

function tags(check?: Check) {
  return z.array(
    z
      .string()
      .min(2, { message: 'Tags need a minimum of 2 characters' })
      .max(30, { message: 'Tags can have a maximum of 30 characters' })
      .refine((value) => check?.(value) ?? true, {
        message: 'The tag name is not allowed.',
      }),
  );
}

function updateTags(check?: Check) {
  return z.object({
    add: tags(check).optional(),
    remove: tags().optional(),
  });
}

type Allowed =
  | { allowed: true }
  | { allowed: false; fields: Array<keyof z.infer<ReturnType<typeof updateSchema>>> };

interface UpdatePermissionsProps {
  project: z.infer<ReturnType<typeof updateSchema>>;
  permissions: string[];
  visibility: EnumUnion<Visibility>;
}

export function updatePermissions(props: UpdatePermissionsProps): Allowed {
  const { project, permissions, visibility } = props;
  const fields: Array<keyof z.infer<ReturnType<typeof updateSchema>>> = [];

  for (const field of objectKeys(project)) {
    if (field === 'id') {
      continue;
    }

    if (!has({ action: `update.${field}`, permissions, visibility })) {
      fields.push(field);
    }
  }

  return fields.length > 0 ? { allowed: false, fields } : { allowed: true };
}
