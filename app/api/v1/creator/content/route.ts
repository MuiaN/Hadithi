import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z, ZodError } from 'zod'; // Ensure ZodError is imported
import { ContentType, ContentStatus, SubscriptionTier, Prisma } from '@prisma/client'; // Import Prisma
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.nativeEnum(ContentType),
  isFree: z.coerce.boolean().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).nullable().optional(),
  readingTime: z.string().optional().or(z.literal('')),
  duration: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  seriesId: z.string().cuid().optional().nullable(),
  chapterNumber: z.coerce.number().int().positive().optional().nullable(),
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
    status: { not: 'ARCHIVED' }, // Default to excluding archived content
  };

  if (seriesIdFilter) {
    where.seriesId = seriesIdFilter;
  }

  if (typeFilter === 'PODCAST') {
    where.type = typeFilter;
    // No status filter here, so the creator can link their own unpublished podcasts.
  } else if (statusFilter) {
    where.status = statusFilter; // Override default if specific status is requested
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

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

// Helper to save file (supports Vercel Blob and local disk)
async function saveFile(file: File, subfolder: string): Promise<string | null> {
  if (!file) return null;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const filename = `media/${subfolder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(filename, file, {
      access: 'public',
    });
    return blob.url;
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  // Create a unique filename
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  // Define the path: public/media/{subfolder}
  const uploadDir = path.join(process.cwd(), 'public', 'media', subfolder);
  
  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });
  
  // Write file
  await writeFile(path.join(uploadDir, filename), uint8Array);
  
  // Return the public URL
  return `/media/${subfolder}/${filename}`;
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

  let formData;
  try {
    formData = await req.formData();
  } catch (e) {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  const rawData: any = {
    title: formData.get('title'),
    description: formData.get('description'),
    content: formData.get('content'),
    type: formData.get('type'),
    status: formData.get('status'),
    isFree: formData.get('isFree') === 'true',
    subscriptionTier: formData.get('subscriptionTier') || null,
    duration: formData.get('duration') || undefined,
    seriesId: formData.get('seriesId') === 'null' ? null : formData.get('seriesId'),
    chapterNumber: formData.get('chapterNumber') ? Number(formData.get('chapterNumber')) : undefined,
    galleryId: formData.get('galleryId') === 'null' ? null : formData.get('galleryId'),
    linkedPodcastId: formData.get('linkedPodcastId') === 'null' ? null : formData.get('linkedPodcastId'),
    tags: formData.getAll('tags').map(t => t.toString()),
  };

  const validation = createContentSchema.safeParse(rawData);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  // Extract all validated data
  const validatedData = validation.data;
  
  const coverImageEntry = formData.get('coverImage');
  const audioFileEntry = formData.get('audioFile');

  if (validatedData.seriesId && (validatedData.chapterNumber === null || validatedData.chapterNumber === undefined)) {
    return NextResponse.json({ message: 'Chapter number is required when content is part of a series' }, { status: 400 });
  }

  // Save files to disk
  let coverImageUrl: string | null = null;
  if (coverImageEntry instanceof File) {
    coverImageUrl = await saveFile(coverImageEntry, 'images');
  } else if (typeof coverImageEntry === 'string') {
    coverImageUrl = coverImageEntry;
  }

  let audioFileUrl: string | null = null;
  if (audioFileEntry instanceof File) {
    audioFileUrl = await saveFile(audioFileEntry, 'podcasts');
  } else if (typeof audioFileEntry === 'string') {
    audioFileUrl = audioFileEntry;
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

      // Store URLs
      coverImage: coverImageUrl,
      audioFile: audioFileUrl,
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