import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z } from 'zod';
import { ContentType, ContentStatus, SubscriptionTier } from '@prisma/client';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { put, del } from '@vercel/blob';

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
  coverImage: string | null;
};

// Helper to save file
async function saveFile(file: File, subfolder: string): Promise<string | null> {
  if (!file) return null;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const filename = `${subfolder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(filename, file, {
      access: 'public',
    });
    return blob.url;
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'media', subfolder);
  
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), uint8Array);
  
  return `/media/${subfolder}/${filename}`;
}

// Helper to delete file
async function deleteFile(fileUrl: string | null) {
  if (!fileUrl) return;
  
  if (process.env.BLOB_READ_WRITE_TOKEN && fileUrl.startsWith('http')) {
    try {
      await del(fileUrl);
    } catch (error) {
      console.error(`Failed to delete blob: ${fileUrl}`, error);
    }
    return;
  }

  // Check if it's a local file (starts with /media/)
  if (fileUrl.startsWith('/media/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${fileUrl}`, error);
      // Continue execution even if file deletion fails
    }
  }
}

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

    const responseData = {
      ...contentItem,
      relatedContent,
    };

    return NextResponse.json(responseData);
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

  let rawData: any = {};
  let coverImageEntry: FormDataEntryValue | null = null;
  let audioFileEntry: FormDataEntryValue | null = null;

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      content: formData.get('content'),
      type: formData.get('type') || undefined,
      status: formData.get('status') || undefined,
      isFree: formData.get('isFree') === 'true',
      subscriptionTier: formData.get('subscriptionTier') || null,
      duration: formData.get('duration') || undefined,
      readingTime: formData.get('readingTime') || undefined,
      seriesId: formData.get('seriesId') === 'null' ? null : formData.get('seriesId'),
      chapterNumber: formData.get('chapterNumber') ? Number(formData.get('chapterNumber')) : null,
      galleryId: formData.get('galleryId') === 'null' ? null : formData.get('galleryId'),
      linkedPodcastId: formData.get('linkedPodcastId') === 'null' ? null : formData.get('linkedPodcastId'),
      tags: formData.getAll('tags').map(t => t.toString()),
    };
    coverImageEntry = formData.get('coverImage');
    audioFileEntry = formData.get('audioFile');
  } else {
    rawData = await req.json();
  }

  const validation = updateContentSchema.safeParse(rawData);

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

    // Handle file uploads
    let coverImageUrl: string | undefined = updateData.coverImage;
    if (coverImageEntry instanceof File) {
      const savedUrl = await saveFile(coverImageEntry, 'images');
      if (savedUrl) coverImageUrl = savedUrl;
    } else if (typeof coverImageEntry === 'string') {
      coverImageUrl = coverImageEntry;
    }

    let audioFileUrl: string | undefined = updateData.audioFile;
    if (audioFileEntry instanceof File) {
      const savedUrl = await saveFile(audioFileEntry, 'podcasts');
      if (savedUrl) audioFileUrl = savedUrl;
    } else if (typeof audioFileEntry === 'string') {
      audioFileUrl = audioFileEntry;
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...statusReset,
        ...(coverImageUrl !== undefined && { coverImage: coverImageUrl }),
        ...(audioFileUrl !== undefined && { audioFile: audioFileUrl }),
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

    return NextResponse.json(updatedContent);
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
    // Delete associated media files
    await deleteFile(contentItem.coverImage);
    await deleteFile(contentItem.audioFile);

    // Hard delete from database
    await prisma.content.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete content ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}