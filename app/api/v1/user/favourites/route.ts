import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/user/favorites:
 *   get:
 *     summary: Retrieves the user's favorite content
 *     description: Fetches all content that the authenticated user has liked.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's favorite content.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const likedContent = await prisma.content.findMany({
    where: {
      likes: { some: { userId: user.id } },
    },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json(likedContent);
}
