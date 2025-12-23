import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z, ZodError } from 'zod';
import { SubscriptionTier } from '@prisma/client';

const galleryImageSchema = z.object({
  url: z.string().url(),
  caption: z.string(),
  alt: z.string(),
});

const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().or(z.literal('')),
  images: z.array(galleryImageSchema).min(1, 'At least one image is required'),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional().default(false),
  isFree: z.boolean().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).nullable().optional(),
});

/**
 * @swagger
 * /api/v1/creator/galleries:
 *   post:
 *     summary: Creates a new gallery
 *     description: Allows an authenticated creator to create a new image gallery.
 *     tags: [Creator, Galleries]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGallery'
 *     responses:
 *       201:
 *         description: Gallery created successfully.
 *       400:
 *         description: Invalid input.
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
  const where: any = { authorId: user.id }; // Initialize where clause

  if (statusFilter === 'published') {
    where.isPublished = true;
  } else if (statusFilter === 'draft') {
    where.isPublished = false;
  }

  try {
    const galleries = await prisma.gallery.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error('Failed to fetch galleries:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = createGallerySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 }); // Changed to ZodError
  }

  const { title, description, images, tags, isPublished, isFree, subscriptionTier } = validation.data;

  try {
    const newGallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        authorId: user.id,
        isPublished: false, // All new galleries start as drafts
        publishedAt: null,
        isFree: isFree ?? true,
        subscriptionTier: isFree ? null : subscriptionTier, // Ensure null if free
        tags: tags || [],
        images: {
          create: images.map((image) => ({
            url: image.url,
            caption: image.caption,
            alt: image.alt,
          })),
        },
      },
      include: { images: true },
    });
    return NextResponse.json(newGallery, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error('Failed to create gallery:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
