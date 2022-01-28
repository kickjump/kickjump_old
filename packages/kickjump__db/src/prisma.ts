// Required with the current build tool.
import Module = require('./generated');

export * from './generated';

export const prisma = new Module.PrismaClient();
