import type { User as RawUser } from '@kickjump/edgedb/types';
import { z } from 'zod';

import {
  type AvailableOptions,
  type Custom,
  type DeepOmit,
  type TypeFromFields,
  AccountProvider,
  createTypeSafeFields,
} from '../db.js';

export type Type<Options extends AvailableOptions = object> = Custom<
  DeepOmit<RawUser, '__type__'>,
  Options
>;

/**
 * Create fields that can be used to extract data from the User Schema.
 */
export const createFields = createTypeSafeFields<Type>();

export const FIELDS = createTypeSafeFields<Type>()({
  id: true,
  accounts: {
    id: true,
    provider: true,
    providerAccountId: true,
  },
  createdAt: true,
  emails: {
    id: true,
    email: true,
    verified: true,
    primary: true,
  },
  image: true,
  name: true,
  updatedAt: true,
  username: true,
});

export type User = TypeFromFields<Type, typeof FIELDS>;

type Check = (value: string) => Promise<boolean>;

export function username(check?: Check) {
  return z
    .string()
    .min(3)
    .max(20)
    .regex(/^[\w.-]+$/, {
      message: 'The username should only include valid alphanumeric characters.',
    })
    .regex(/^[^._-]+/, { message: 'Please start with an alphanumeric character [a-z] or [0-9]' })
    .refine((value) => !/[._-]{2,}/.test(value), {
      message: "Special characters `-_.` shouldn't repeat.",
    })
    .refine((value) => check?.(value) ?? true, {
      message: 'The requested username is not available.',
    })
    .transform((value) => value.toLocaleLowerCase());
}

export function email() {
  return z.object({
    email: z.string().email(),
    primary: z.boolean(),
    verified: z.boolean(),
  });
}

export function account() {
  return z.object({
    providerAccountId: z.string(),
    provider: z.nativeEnum(AccountProvider),
    accessToken: z.string().optional(),
    login: z.string().optional(),
    refreshToken: z.string().optional(),
    scope: z.array(z.string()).optional(),
  });
}

interface CreateSchemaProps {
  username?: Check;
}

export function createSchema(props: CreateSchemaProps) {
  return z.object({
    name: z.string().optional(),
    image: z.string().url().optional(),
    username: username(props.username),
    emails: z.array(email()).optional(),
    accounts: z.array(account()).optional(),
  });
}
