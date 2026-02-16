import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

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

export async function POST(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folderName = formData.get('folderName') as string;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const subfolder = folderName 
      ? `images/${folderName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}` 
      : 'images';

    const url = await saveFile(file, subfolder);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
