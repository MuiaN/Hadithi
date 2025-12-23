import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/creator/analytics:
 *   get:
 *     summary: Retrieves analytics for the authenticated creator
 *     description: Fetches aggregated statistics for the creator's content.
 *     tags: [Creator, Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Creator analytics data.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const stats = await prisma.content.aggregate({
    where: { authorId: user.id, status: 'PUBLISHED' },
    _sum: {
      views: true,
    },
    _count: {
      _all: true,
    },
  });

  const contentCount = await prisma.content.count({
    where: { authorId: user.id },
  });

    const topContent = await prisma.content.findMany({
    where: { authorId: user.id, status: 'PUBLISHED' },
    orderBy: { views: 'desc' },
    take: 5,
    select: { id: true, title: true, coverImage: true, views: true, _count: { select: { likes: true } }, series: { select: { title: true } }, chapterNumber: true },
  });

  const totalLikes = await prisma.like.count({
    where: { content: { authorId: user.id } },
  });

  const totalComments = await prisma.comment.count({
    where: {
      content: { authorId: user.id },
    },
  });

  const topContentWithImages = topContent.map(item => ({
    ...item,
    coverImage: item.coverImage
      ? `data:image/jpeg;base64,${item.coverImage.toString('base64')}`
      : null,
  }));

  const analyticsData = {
    totalViews: stats._sum.views || 0,
    totalLikes: totalLikes || 0,
    totalComments: totalComments || 0,
    contentCount: contentCount,
    topContent: topContentWithImages,
    viewsOverTime: [], // Placeholder for time-series data
  };

  return NextResponse.json(analyticsData);
}