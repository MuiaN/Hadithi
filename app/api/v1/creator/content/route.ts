import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z, ZodError } from 'zod'; // Ensure ZodError is imported
import { ContentType, ContentStatus, SubscriptionTier, Prisma } from '@prisma/client'; // Import Prisma

const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional(), // Now expects a Base64 string
  type: z.nativeEnum(ContentType),
  isFree: z.boolean().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).nullable().optional(),
  readingTime: z.string().optional().or(z.literal('')),
  duration: z.string().optional().or(z.literal('')),
  audioFile: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seriesId: z.string().cuid().optional().nullable(),
  chapterNumber: z.number().int().positive().optional().nullable(),
  galleryId: z.string().cuid().optional().nullable(),
  status: z.nativeEnum(ContentStatus).optional(),
  linkedPodcastId: z.string().cuid().optional().nullable(),
});

/**
 * @swagger
 * /api/v1/creator/content:
 *   get:
 *     summary: Retrieves the creator's content
 *     description: Fetches a list of content authored by the authenticated creator, with optional filters.
 *     tags: [Creator, Content]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, PENDING_APPROVAL, ARCHIVED]
 *         description: Filter content by status.
 *       - in: query
 *         name: seriesId
 *         schema:
 *           type: string
 *         description: Filter content by series ID.
 *     responses:
 *       200:
 *         description: A list of content items.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const seriesIdFilter = searchParams.get('seriesId');
  const typeFilter = searchParams.get('type');

  const where: any = {
    authorId: user.id,
  };

  if (seriesIdFilter) {
    where.seriesId = seriesIdFilter;
  }

  if (typeFilter === 'PODCAST') {
    where.type = typeFilter;
    // No status filter here, so the creator can link their own unpublished podcasts.
  } else if (statusFilter) {
    where.status = statusFilter;
  }

  try {
    const content = await prisma.content.findMany({
      where,
      include: {
        author: { select: { name: true, avatar: true } },
        series: { select: { title: true } },
        linkedPodcast: { select: { title: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert coverImage Buffer to base64 data URL for client-side rendering
    const contentWithImages = content.map((item: any) => ({
      ...item,
      coverImage: item.coverImage
        ? `data:image/jpeg;base64,${Buffer.from(item.coverImage).toString('base64')}`
        : null,
    }));

    return NextResponse.json(contentWithImages);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/creator/content:
 *   post:
 *     summary: Creates new content
 *     description: Allows an authenticated creator to create a new content item (e.g., story, article).
 *     tags: [Creator, Content]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContent'
 *     responses:
 *       201:
 *         description: Content created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function POST(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = createContentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  // Extract all validated data
  const validatedData = validation.data;

  if (validatedData.seriesId && (validatedData.chapterNumber === null || validatedData.chapterNumber === undefined)) {
    return NextResponse.json({ message: 'Chapter number is required when content is part of a series' }, { status: 400 });
  }

  try {
    // Construct the data object for Prisma explicitly
    const prismaData: Prisma.ContentCreateInput = {
      title: validatedData.title,
      description: validatedData.description,
      content: validatedData.content,
      type: validatedData.type,
      isFree: validatedData.isFree ?? false, // Ensure boolean default
      subscriptionTier: validatedData.subscriptionTier,
      readingTime: validatedData.readingTime,
      duration: validatedData.duration,
      status: validatedData.status || ContentStatus.DRAFT,
      chapterNumber: validatedData.chapterNumber,
      
      // Connect relations
      author: { connect: { id: user.id } },
      series: validatedData.seriesId ? { connect: { id: validatedData.seriesId } } : undefined,
      gallery: validatedData.galleryId ? { connect: { id: validatedData.galleryId } } : undefined,
      linkedPodcast: validatedData.linkedPodcastId ? { connect: { id: validatedData.linkedPodcastId } } : undefined,
      tags: validatedData.tags ? {
        connectOrCreate: validatedData.tags.map((tagName: string) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      } : undefined,

      // Convert Base64 strings to Buffer for Bytes fields
      coverImage: validatedData.coverImage
        ? Buffer.from(validatedData.coverImage.split(',')[1], 'base64')
        : null,
      audioFile: validatedData.audioFile
        ? Buffer.from(validatedData.audioFile.split(',')[1], 'base64')
        : null,
    };

    const newContent = await prisma.content.create({
      data: prismaData,
      include: {
        series: { select: { title: true } },
        tags: { select: { name: true } }, // Include tags for the response
      },
    });
    return NextResponse.json(newContent, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error('Failed to create content:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}