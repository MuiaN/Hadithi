import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { SubscriptionTier, ContentStatus } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

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

  if (statusFilter && statusFilter !== 'all') {
    where.status = statusFilter;
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

  let formData;
  try {
    formData = await req.formData();
  } catch (e) {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as ContentStatus;
  const isFree = formData.get('isFree') === 'true';
  const subscriptionTier = formData.get('subscriptionTier') as SubscriptionTier | null;
  const tags = formData.getAll('tags').map(t => t.toString());
  
  const images = formData.getAll('images');
  const captions = formData.getAll('captions') as string[];
  const alts = formData.getAll('alts') as string[];

  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  if (images.length === 0) {
    return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });
  }

  try {
    const savedImagesData = [];
    for (let i = 0; i < images.length; i++) {
      const imageEntry = images[i];
      const caption = captions[i] || '';
      const alt = alts[i] || '';
      
      let url: string | null = null;
      if (imageEntry instanceof File) {
        url = await saveGalleryImage(imageEntry, title);
      } else if (typeof imageEntry === 'string') {
        url = imageEntry;
      }

      if (url) {
        savedImagesData.push({ url, caption, alt });
      }
    }

    const newGallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        authorId: user.id,
        status: status || ContentStatus.DRAFT,
        isPublished: status === ContentStatus.PUBLISHED,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
        isFree: isFree ?? true,
        subscriptionTier: isFree ? null : subscriptionTier, // Ensure null if free
        tags: tags || [],
        images: {
          create: savedImagesData.map((image) => ({
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
    console.error('Failed to create gallery:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

// Helper to save gallery image
async function saveGalleryImage(file: File, galleryTitle: string): Promise<string | null> {
  if (!file) return null;

  // Sanitize gallery title for folder name
  const sanitizedTitle = galleryTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blobPath = `media/galleries/${sanitizedTitle}/${filename}`;
    const blob = await put(blobPath, file, { access: 'public' });
    return blob.url;
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Define the path: public/media/galleries/[gallery name]
  const uploadDir = path.join(process.cwd(), 'public', 'media', 'galleries', sanitizedTitle);
  
  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });
  
  // Write file
  await writeFile(path.join(uploadDir, filename), uint8Array);
  
  // Return the public URL
  return `/media/galleries/${sanitizedTitle}/${filename}`;
}
