import type { User } from '../generated';
import { prisma } from '../prisma';

/**
 * Create a user.
 */
export async function create(name: string): Promise<User> {
  return prisma.user.create({ data: { name } });
}
