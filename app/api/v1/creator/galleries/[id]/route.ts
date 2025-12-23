import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z } from 'zod';
import { SubscriptionTier } from '@prisma/client';

const galleryImageSchema = z.object({
  url: z.string().url(),
  caption: z.string(),
  alt: z.string(),
});

const updateGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional().or(z.literal('')),
  images: z.array(galleryImageSchema).min(1, 'At least one image is required').optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  isFree: z.boolean().optional(),
  subscriptionTier: z.nativeEnum(SubscriptionTier).nullable().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const gallery = await prisma.gallery.findFirst({
      where: {
        id: params.id,
        authorId: user.id,
      },
      include: {
        images: true,
        author: { select: { name: true, avatar: true } },
      },
    });

    return gallery ? NextResponse.json(gallery) : NextResponse.json({ message: 'Gallery not found' }, { status: 404 });
  } catch (error) {
    console.error(`Failed to fetch gallery ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const gallery = await prisma.gallery.findUnique({
    where: { id: params.id },
  });

  if (!gallery || gallery.authorId !== user.id) {
    return NextResponse.json({ message: 'Gallery not found or you do not have permission to edit it' }, { status: 404 });
  }

  const body = await req.json();
  const validation = updateGallerySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { images, ...updateData } = validation.data;

  try {
    const updatedGallery = await prisma.gallery.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(images && {
          images: {
            deleteMany: {}, // Delete existing images
            create: images.map(img => ({
              url: img.url,
              caption: img.caption,
              alt: img.alt,
            })),
          },
        }),
      },
    });
    return NextResponse.json(updatedGallery);
  } catch (error) {
    console.error(`Failed to update gallery ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const gallery = await prisma.gallery.findUnique({
    where: { id: params.id },
  });

  if (!gallery || gallery.authorId !== user.id) {
    return NextResponse.json({ message: 'Gallery not found or you do not have permission to delete it' }, { status: 404 });
  }

  try {
    // Use a transaction to delete images and then the gallery
    await prisma.$transaction([
      prisma.galleryImage.deleteMany({
        where: { galleryId: params.id },
      }),
      prisma.gallery.delete({
        where: { id: params.id },
      }),
    ]);

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Failed to delete gallery ${params.id}:`, error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
