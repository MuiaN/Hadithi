import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { SubscriptionTier, ContentStatus } from '@prisma/client';
import { writeFile, mkdir, unlink, rm } from 'fs/promises';
import path from 'path';
import { put, del } from '@vercel/blob';

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
    }
  }
}

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
    include: { images: true },
  });

  if (!gallery || gallery.authorId !== user.id) {
    return NextResponse.json({ message: 'Gallery not found or you do not have permission to edit it' }, { status: 404 });
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
  
  // Parse images metadata
  const imagesMetadataJson = formData.get('imagesMetadata') as string;
  const imagesMetadata = imagesMetadataJson ? JSON.parse(imagesMetadataJson) : [];
  const newImageEntries = formData.getAll('newImages');

  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  try {
    // Process images
    const finalImages = [];
    let newFileIndex = 0;

    // 1. Identify images to keep and new images to save
    for (const meta of imagesMetadata) {
      if (meta.isNew) {
        const entry = newImageEntries[newFileIndex++];
        let url: string | null = null;
        
        if (entry instanceof File) {
          url = await saveGalleryImage(entry, title);
        } else if (typeof entry === 'string') {
          url = entry;
        }

        if (url) {
          finalImages.push({ url, caption: meta.caption, alt: meta.alt });
        }
      } else {
        finalImages.push({ url: meta.url, caption: meta.caption, alt: meta.alt });
      }
    }

    // 2. Identify deleted images to remove from disk
    const existingImageUrls = new Set(gallery.images.map(img => img.url));
    const finalImageUrls = new Set(finalImages.map(img => img.url));
    
    for (const existingUrl of Array.from(existingImageUrls)) {
      if (!finalImageUrls.has(existingUrl)) {
        await deleteFile(existingUrl);
      }
    }

    const updatedGallery = await prisma.gallery.update({
      where: { id: params.id },
      data: {
        title,
        description,
        isFree,
        subscriptionTier: isFree ? null : subscriptionTier,
        tags,
        ...(status && { status, isPublished: status === ContentStatus.PUBLISHED }),
        images: {
          deleteMany: {}, // Clear existing relations
          create: finalImages, // Create new relations
        },
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
    include: { images: true }
  });

  if (!gallery || gallery.authorId !== user.id) {
    return NextResponse.json({ message: 'Gallery not found or you do not have permission to delete it' }, { status: 404 });
  }

  try {
    // Delete all image files from disk
    const dirsToCheck = new Set<string>();
    for (const image of gallery.images) {
      await deleteFile(image.url);
      if (image.url.startsWith('/media/galleries/')) {
        const dirPath = path.dirname(path.join(process.cwd(), 'public', image.url));
        dirsToCheck.add(dirPath);
      }
    }

    // Also try to delete the folder for the current title
    const sanitizedTitle = gallery.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const currentDir = path.join(process.cwd(), 'public', 'media', 'galleries', sanitizedTitle);
    dirsToCheck.add(currentDir);

    for (const dir of Array.from(dirsToCheck)) {
      try {
        await rm(dir, { recursive: true, force: true });
      } catch (e) {
        console.error(`Failed to remove directory ${dir}:`, e);
      }
    }

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
