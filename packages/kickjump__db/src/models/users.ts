import type { Prisma, UserWallet } from '@kickjump/prisma';

import { ACCOUNT_FIELDS, NESTED_POPULATED_USER, POPULATED_USER } from '../constants.js';
import { prisma } from '../prisma.js';
import type { LinkAccountToUser, PopulatedAccount, PopulatedUser } from '../types.js';

/**
 * Get the populated user from their email address.
 */
export async function getByEmail(email: string): Promise<PopulatedUser | undefined> {
  const result = await prisma.email.findUnique({
    where: { email },
    include: NESTED_POPULATED_USER,
  });

  if (!result) {
    return;
  }

  return result.user;
}

/**
 * Get the user by their wallet public key.
 */
export async function getByWallet(publicKey: string): Promise<PopulatedUser | undefined> {
  const result = await prisma.userWallet.findUnique({
    where: { publicKey },
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

/**
 * Link the account
 */
export async function linkAccount(data: LinkAccountToUser): Promise<PopulatedAccount> {
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

interface LinkWalletProps {
  userId: string;
  publicKey: string;
}

/**
 * Link the provided wallet.
 */
export async function linkWallet({ userId, publicKey }: LinkWalletProps): Promise<UserWallet> {
  return prisma.userWallet.create({ data: { userId, publicKey } });
}

/**
 * Unlink the wallet. Check that the wallet belongs to the correct user before
 * using this method.
 */
export async function unlinkWallet(publicKey: string): Promise<UserWallet> {
  return prisma.userWallet.delete({ where: { publicKey } });
}
