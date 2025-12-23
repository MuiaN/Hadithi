import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z } from 'zod';
import { ContentType, ContentStatus, SubscriptionTier } from '@prisma/client';

const updateContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  rejectionReason: z.string().optional().nullable(),
  coverImage: z.string().optional(),
  type: z.nativeEnum(ContentType),
  status: z.nativeEnum(ContentStatus).optional(),
  isFree: z.boolean().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).nullable().optional(),
  readingTime: z.string().optional().or(z.literal('')),
  duration: z.string().optional().or(z.literal('')),
  audioFile: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seriesId: z.string().cuid().optional().nullable(),
  chapterNumber: z.number().int().positive().optional().nullable(),
  linkedPodcastId: z.string().cuid().optional().nullable(),
}).partial(); // Use partial for updates

type RelatedContent = {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  chapterNumber: number | null;
  coverImage: Buffer | null;
};

/**
 * @swagger
 * /api/v1/creator/content/{id}:
 *   get:
 *     summary: Retrieves a specific content item
 *     description: Allows an authenticated creator to fetch a single content item they own.
 *     tags: [Creator, Content]
 *     security:
 *       - cookieAuth: []
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
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Content not found or not owned by the user.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch the main content item
    const contentItem = await prisma.content.findFirst({
      where: {
        id: params.id,
        authorId: user.id,
      },
      include: {
        author: { select: { name: true, avatar: true } },
        series: { select: { id: true, title: true } },
        tags: { select: { name: true } }, // Assuming gallery has a coverImage field to select
        linkedPodcast: { select: { id: true, title: true, createdAt: true, coverImage: true } },
        gallery: { 
          select: { 
            id: true, 
            title: true, 
            createdAt: true,
            images: {
              select: { url: true },
              take: 1
            }
          } 
        },
        linkedFromContent: { select: { id: true, title: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!contentItem) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // If the content is part of a series, fetch other content in that series
    let relatedContent: RelatedContent[] = [];
    if (contentItem.seriesId) {
      relatedContent = await prisma.content.findMany({
        where: {
          seriesId: contentItem.seriesId,
          id: { not: params.id }, // Exclude the current item
          authorId: user.id,
        },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          chapterNumber: true,
          coverImage: true,
        },
        orderBy: { chapterNumber: 'asc' },
      });
    }

    // Process related content images
    const relatedContentWithImages = relatedContent.map(item => ({
      ...item,
      coverImage: item.coverImage
        ? `data:image/jpeg;base64,${item.coverImage.toString('base64')}`
        : null,
    }));

    // Convert coverImage and audioFile Buffers to base64 data URLs for client-side rendering
    const contentWithMedia = {
      ...contentItem,
      coverImage: contentItem.coverImage
        ? `data:image/jpeg;base64,${contentItem.coverImage.toString('base64')}`
        : null,
      audioFile: contentItem.audioFile
        ? `data:audio/mpeg;base64,${contentItem.audioFile.toString('base64')}`
        : null,
      relatedContent: relatedContentWithImages,
    };

    // Process linked podcast image if it exists
    if (contentWithMedia.linkedPodcast && contentWithMedia.linkedPodcast.coverImage) {
      (contentWithMedia.linkedPodcast.coverImage as any) = `data:image/jpeg;base64,${(contentWithMedia.linkedPodcast.coverImage as Buffer).toString('base64')}`;
    }

    return NextResponse.json(contentWithMedia);
  } catch (error) {
    console.error(`Failed to fetch content ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/creator/content/{id}:
 *   put:
 *     summary: Updates a content item
 *     description: Allows an authenticated creator to update an existing content item.
 *     tags: [Creator, Content]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content item to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateContent'
 *     responses:
 *       200:
 *         description: Content updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Content not found or not owned by the user.
 *       500:
 *         description: Internal server error.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const contentItem = await prisma.content.findUnique({
    where: { id: params.id },
  });

  if (!contentItem || contentItem.authorId !== user.id) {
    return NextResponse.json({ message: 'Content not found or you do not have permission to edit it' }, { status: 404 });
  }

  const body = await req.json();
  const validation = updateContentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { seriesId, chapterNumber, tags, linkedPodcastId, ...updateData }: any = validation.data;

  if (seriesId !== undefined || chapterNumber !== undefined) {
    if (seriesId === null && chapterNumber !== null) {
      return NextResponse.json({ message: 'Chapter number cannot be set without a series' }, { status: 400 });
    }
    if (seriesId !== null && (chapterNumber === null || chapterNumber === undefined)) {
      return NextResponse.json({ message: 'Chapter number is required when content is part of a series' }, { status: 400 });
    }
  }

  try {
    // If a creator edits a piece that is pending approval, reset its status to draft.
    const statusReset = (contentItem.status === ContentStatus.PENDING_APPROVAL && user.role === 'CREATOR')
      ? { status: ContentStatus.DRAFT, publishedAt: null, rejectionReason: null }
      : {};


    // Handle tags separately
    const tagOperations = tags ? {
      // Disconnect all existing tags first
      set: [],
      // Then connect the new set of tags
      connectOrCreate: tags.map((tagName: string) => ({
        where: { name: tagName },
        create: { name: tagName },
      })),
    } : undefined;

    // Convert base64 cover image to buffer if it exists
    let coverImageBuffer: Buffer | undefined = undefined;
    if (updateData.coverImage && updateData.coverImage.startsWith('data:image')) {
        const base64Data = updateData.coverImage.replace(/^data:image\/\w+;base64,/, '');
        coverImageBuffer = Buffer.from(base64Data, 'base64');
    }

    // Convert base64 audio file to buffer if it exists
    let audioFileBuffer: Buffer | undefined = undefined;
    if (updateData.audioFile && updateData.audioFile.startsWith('data:audio')) {
        const base64Data = updateData.audioFile.replace(/^data:audio\/\w+;base64,/, '');
        audioFileBuffer = Buffer.from(base64Data, 'base64');
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...statusReset,
        ...(coverImageBuffer && { coverImage: coverImageBuffer }),
        ...(audioFileBuffer && { audioFile: audioFileBuffer }),
        seriesId,
        chapterNumber,
        linkedPodcastId,
        ...(tags && { tags: tagOperations }),
        ...(updateData.status === ContentStatus.PUBLISHED && !contentItem.publishedAt && { publishedAt: new Date().toISOString() }),
        ...(updateData.status && updateData.status !== ContentStatus.PUBLISHED && contentItem.publishedAt && { publishedAt: null }),
      },
      include: { 
        series: { select: { title: true } },
        tags: { select: { name: true } },
      },
    });

    // Convert coverImage and audioFile Buffers back to base64 for the response
    const responseWithMedia = {
      ...updatedContent,
      coverImage: updatedContent.coverImage
        ? `data:image/jpeg;base64,${updatedContent.coverImage.toString('base64')}`
        : null,
      audioFile: updatedContent.audioFile
        ? `data:audio/mpeg;base64,${updatedContent.audioFile.toString('base64')}`
        : null,
    };
    return NextResponse.json(responseWithMedia);
  } catch (error) {
    console.error(`Failed to update content ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/creator/content/{id}:
 *   delete:
 *     summary: Deletes a content item
 *     description: Allows an authenticated creator to delete an existing content item.
 *     tags: [Creator, Content]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content item to delete.
 *     responses:
 *       204:
 *         description: Content deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Content not found or not owned by the user.
 *       500:
 *         description: Internal server error.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const contentItem = await prisma.content.findUnique({
    where: { id: params.id },
  });

  if (!contentItem || contentItem.authorId !== user.id) {
    return NextResponse.json({ message: 'Content not found or you do not have permission to delete it' }, { status: 404 });
  }

  try {
    // Soft delete by updating the status to ARCHIVED
    await prisma.content.update({
      where: { id: params.id },
      data: {
        status: ContentStatus.ARCHIVED,
        publishedAt: null, // Unpublish if it was published
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete content ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}