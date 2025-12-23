import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/creator/comments:
 *   get:
 *     summary: Retrieves comments on the creator's content
 *     description: Fetches all comments on content authored by the authenticated creator.
 *     tags: [Creator, Comments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of comments.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const seriesIdFilter = searchParams.get('seriesId');

  const where: any = {
    content: {
      authorId: user.id,
    },
  };

  if (statusFilter) {
    where.content.status = statusFilter;
  }

  if (seriesIdFilter) {
    where.content.seriesId = seriesIdFilter;
  }

  try {
    const comments = await prisma.comment.findMany({
      where,
      include: {
        author: { select: { name: true, avatar: true } },
        content: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
