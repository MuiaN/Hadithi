import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';

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
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
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
  // In a real app, you'd get the user from a session and verify their role (EDITOR/ADMIN) here.
  // This would be handled by middleware injecting user data into the request.

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as ContentStatus | null;

  try {
    const content = await prisma.content.findMany({
      where: status ? { status } : {},
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
