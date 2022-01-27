import { PrismaClient } from './generated';

export * from './generated';

/**
 * @internal
 */
export const prisma = new PrismaClient();
