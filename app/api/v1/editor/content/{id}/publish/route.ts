import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/editor/content/{id}/publish:
 *   put:
 *     summary: Publishes a piece of content
 *     description: Changes the status of a content item from DRAFT to PUBLISHED.
 *     tags: [Editor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to publish.
 *     responses:
 *       200:
 *         description: Content published successfully.
 *       404:
 *         description: Content not found.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const publishedContent = await prisma.content.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
    return NextResponse.json(publishedContent);
  } catch (error) {
    console.error(`Failed to publish content ${id}:`, error);
    return NextResponse.json({ message: 'Content not found or failed to update' }, { status: 404 });
  }
}