import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/editor/comments:
 *   get:
 *     summary: Retrieves all comments for moderation
 *     description: Fetches all comments across all content for editors to review.
 *     tags: [Editor, Comments]
 *     responses:
 *       200:
 *         description: A list of comments.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, avatar: true } },
        content: { select: { title: true } },
      },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments for editor:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}