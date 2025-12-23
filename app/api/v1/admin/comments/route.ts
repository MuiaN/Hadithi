import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: { select: { name: true, avatar: true } },
        content: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
