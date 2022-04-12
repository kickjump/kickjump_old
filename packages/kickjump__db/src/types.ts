import type { Prisma } from '@kickjump/prisma';

import type { ACCOUNT_FIELDS, POPULATED_USER } from './constants.js';

interface Include<Type> {
  include: Type;
}

interface Select<Type> {
  select: Type;
}

export type PopulatedUser = Prisma.UserGetPayload<Include<typeof POPULATED_USER>>;
export type PopulatedAccount = Prisma.AccountGetPayload<Select<typeof ACCOUNT_FIELDS>>;
