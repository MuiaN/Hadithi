import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/editor/analytics:
 *   get:
 *     summary: Retrieves analytics data for the editor dashboard
 *     description: Fetches aggregated statistics about content, views, likes, and review status.
 *     tags: [Editor, Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A JSON object containing editor analytics.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalContent = await prisma.content.count();
    const publishedContentCount = await prisma.content.count({ where: { status: 'PUBLISHED' } });
    const draftContentCount = await prisma.content.count({ where: { status: 'DRAFT' } });
    const archivedContentCount = await prisma.content.count({ where: { status: 'ARCHIVED' } });

    const contentStats = await prisma.content.aggregate({
      where: { status: 'PUBLISHED' },
      _sum: {
        views: true,
      },
    });

    const topContent = await prisma.content.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5,
      include: {
        author: { select: { name: true } },
        _count: { select: { likes: true } },
      },
    });

    const analytics = {
      totalContent,
      publishedContent: publishedContentCount,
      totalViews: contentStats._sum.views || 0,
      pendingReview: draftContentCount,
      topContent,
      reviewStats: {
        approved: publishedContentCount,
        rejected: archivedContentCount,
        pending: draftContentCount,
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Failed to fetch editor analytics:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}