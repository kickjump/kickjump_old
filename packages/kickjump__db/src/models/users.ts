import type { User } from '@kickjump/prisma';
import { prisma } from '../prisma';

/**
 * Create a user.
 */
export async function create(name: string): Promise<User> {
  return prisma.user.create({ data: { name } });
}
