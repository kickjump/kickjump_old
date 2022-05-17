import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
export const { Prisma, PrismaClient, prisma } = require('./dist');
