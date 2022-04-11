import type { Prisma } from '@kickjump/prisma';

import { prisma } from '../prisma.js';
import { ACCOUNT_FIELDS, NESTED_POPULATED_USER, POPULATED_USER } from './model-constants';
import type { PopulatedAccount, PopulatedUser } from './model-types';

export async function getByEmail(email: string): Promise<PopulatedUser | undefined> {
  const result = await prisma.email.findUnique({
    where: { email: email ?? undefined },
    include: NESTED_POPULATED_USER,
  });

  if (!result) {
    return;
  }

  return result.user;
}

/**
 * Get a user by the `provider` and `providerAccountId`
 */
export async function getByAccount(
  provider_providerAccountId: ByAccountProps,
): Promise<PopulatedUser | undefined> {
  const result = await prisma.account.findUnique({
    where: { provider_providerAccountId },
    include: NESTED_POPULATED_USER,
  });

  if (!result) {
    return;
  }

  return result.user;
}

/**
 * Create a user with the provided data.
 */
export async function create(
  data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
): Promise<PopulatedUser> {
  return prisma.user.create({ data, include: POPULATED_USER });
}

/**
 * Get a user by their `id`
 */
export async function get(id: string): Promise<PopulatedUser | undefined> {
  const user = await prisma.user.findUnique({ where: { id }, include: POPULATED_USER });
  return user ?? undefined;
}

type UpdateProps = { id: string } & Omit<
  Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>,
  'id'
>;

/**
 * Update the user.
 */
export async function update({ id, ...data }: UpdateProps) {
  return prisma.user.update({ where: { id: '' }, data });
}

/**
 * Delete the user by their `id`.
 */
export async function remove(id: string) {
  return prisma.user.delete({ where: { id } });
}

type LinkAccountProps = Prisma.XOR<Prisma.AccountCreateInput, Prisma.AccountUncheckedCreateInput>;

/**
 * Link the account
 */
export async function linkAccount(data: LinkAccountProps): Promise<PopulatedAccount> {
  return prisma.account.create({ data, select: ACCOUNT_FIELDS });
}

interface ByAccountProps {
  provider: string;
  providerAccountId: string;
}

/**
 * Remove the account from the user.
 */
export async function unlinkAccount(provider_providerAccountId: ByAccountProps) {
  await prisma.account.delete({ where: { provider_providerAccountId } });
}
