import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/user/stats:
 *   get:
 *     summary: Retrieves statistics for the authenticated user
 *     description: Fetches aggregated stats like articles read, favorites, and comments for the user's dashboard.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: An object containing user statistics.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const articlesReadCount = await prisma.readingHistory.count({
      where: { userId: user.id, completed: true },
    });

    const articlesReadThisMonth = await prisma.readingHistory.count({
      where: {
        userId: user.id,
        completed: true,
        lastReadAt: { gte: startOfMonth },
      },
    });

    const favoritesCount = await prisma.like.count({
      where: { userId: user.id },
    });

    const commentsCount = await prisma.comment.count({
      where: { authorId: user.id },
    });

    return NextResponse.json({
      articlesRead: articlesReadCount,
      articlesReadThisMonth: articlesReadThisMonth,
      favorites: favoritesCount,
      comments: commentsCount,
      timeSpent: articlesReadCount * 7, // Placeholder: average 7 mins per article
    });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}