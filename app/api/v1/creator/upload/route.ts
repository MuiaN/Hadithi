import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request): Promise<NextResponse> {
  const user = await getAuth(request as any);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const pathname = formData.get('pathname') as string;

      if (!file) {
        return NextResponse.json({ message: 'No file provided' }, { status: 400 });
      }

      const buffer = new Uint8Array(await file.arrayBuffer());
      const relativePath = pathname || `media/uploads/${Date.now()}-${file.name}`;
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, buffer);

      return NextResponse.json({
        url: `/${relativePath}`,
        pathname: relativePath,
        contentType: file.type,
        contentDisposition: `attachment; filename="${file.name}"`
      });
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
          tokenPayload: JSON.stringify({
            userId: user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob uploaded', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times automatically if the status code is 500
    );
  }
}