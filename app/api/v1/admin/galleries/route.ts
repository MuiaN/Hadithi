import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        images: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
