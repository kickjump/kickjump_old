import type { Project, User } from '@kickjump/prisma';

import { prisma } from '../prisma.js';

export function get({
  id,
  userId,
}: Pick<Project, 'id'> & {
  userId: User['id'];
}) {
  return prisma.project.findFirst({
    where: { id, userId },
  });
}

export function getForUser({ userId }: { userId: User['id'] }) {
  return prisma.project.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: 'desc' },
  });
}

export function create({
  description,
  title,
  userId,
}: Pick<Project, 'description' | 'title'> & {
  userId: User['id'];
}) {
  return prisma.project.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function remove({ id, userId }: Pick<Project, 'id'> & { userId: User['id'] }) {
  return prisma.project.deleteMany({
    where: { id, userId },
  });
}
