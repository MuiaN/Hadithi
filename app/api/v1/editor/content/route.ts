import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/editor/content:
 *   get:
 *     summary: Retrieves content for the editor dashboard
 *     description: Fetches all content, allowing editors to filter by status (DRAFT, PUBLISHED, ARCHIVED). This is a protected route for editors and admins.
 *     tags: [Editor]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, PENDING_APPROVAL, REJECTED]
 *         description: Filter content by its status.
 *     responses:
 *       200:
 *         description: A list of content items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as ContentStatus | null;

  try {
    const content = await prisma.content.findMany({
      where: status ? { status } : {
        status: {
          in: [ContentStatus.PENDING_APPROVAL, ContentStatus.PUBLISHED, ContentStatus.REJECTED]
        }
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        author: { select: { name: true } },
        _count: { select: { likes: true } },
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch content for editor:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
