import Module = require('./generated'); // Required with the current build tool.
// import { PrismaClient } from './generated';
// import * as Module from './generated';

export * from './generated';

/**
 * @internal
 */
// export const prisma = new PrismaClient();
export const prisma = new Module.PrismaClient();
