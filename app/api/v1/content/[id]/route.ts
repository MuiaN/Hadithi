import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ContentStatus } from '@prisma/client';

/**
 * @swagger
 * /api/v1/content/{id}:
 *   get:
 *     summary: Retrieves a single published content item for public view
 *     description: Fetches a specific content item by its ID if it is published. This endpoint is public and also increments the view count.
 *     tags: [Public, Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content item to retrieve.
 *     responses:
 *       200:
 *         description: The content item.
 *       404:
 *         description: Content not found or not published.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contentItem = await prisma.content.findFirst({
      where: {
        id: params.id,
        status: ContentStatus.PUBLISHED,
      },
      include: {
        author: { select: { name: true, avatar: true, bio: true } },
        series: { select: { id: true, title: true } },
        tags: { select: { name: true } },
        gallery: { select: { id: true, title: true } },
        linkedPodcast: { select: { id: true, title: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!contentItem) {
      return NextResponse.json({ message: 'Content not found or not published' }, { status: 404 });
    }

    // Increment view count
    await prisma.content.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    const contentWithMedia = {
      ...contentItem,
      coverImage: contentItem.coverImage
        ? `data:image/jpeg;base64,${contentItem.coverImage.toString('base64')}`
        : null,
      audioFile: contentItem.audioFile
        ? `data:audio/mpeg;base64,${contentItem.audioFile.toString('base64')}`
        : null,
    };
    return NextResponse.json(contentWithMedia);
  } catch (error) {
    console.error(`Failed to fetch content ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}