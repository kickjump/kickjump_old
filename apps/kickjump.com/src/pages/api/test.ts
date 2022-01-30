import { prisma } from '@kickjump/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function testHandler(_: NextApiRequest, res: NextApiResponse) {
  const values = await prisma.user.findMany();
  return res.status(200).json({ test: true, values });
}
