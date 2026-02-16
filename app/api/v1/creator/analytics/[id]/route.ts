import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    // 1. Try to find content
    const content = await prisma.content.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        authorId: user.id 
      },
      include: {
        _count: {
          select: { likes: true, comments: true }
        },
        likes: {
            where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Last 30 days
            select: { createdAt: true }
        },
        comments: {
            where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Last 30 days
            select: { createdAt: true }
        }
      }
    });

    if (content) {
      return NextResponse.json({
        type: content.type, // STORY, ARTICLE, BOOK, PODCAST
        title: content.title,
        views: content.views,
        likes: content._count.likes,
        comments: content._count.comments,
        createdAt: content.createdAt,
        publishedAt: content.publishedAt,
        status: content.status,
        engagementHistory: processHistory(content.likes, content.comments)
      });
    }

    // 2. Try to find gallery
    const gallery = await prisma.gallery.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        authorId: user.id 
      },
    });

    if (gallery) {
      return NextResponse.json({
        type: 'GALLERY',
        title: gallery.title,
        views: gallery.viewCount,
        likes: 0, // Galleries don't have likes in schema yet
        comments: 0, // Galleries don't have comments in schema yet
        createdAt: gallery.createdAt,
        publishedAt: gallery.publishedAt,
        status: gallery.status,
        engagementHistory: processHistory([], []) // Empty history for now
      });
    }

    return NextResponse.json({ message: 'Content not found' }, { status: 404 });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

function processHistory(likes: { createdAt: Date }[], comments: { createdAt: Date }[]) {
  const map = new Map<string, { date: string; likes: number; comments: number }>();
  
  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    map.set(dateStr, { date: dateStr, likes: 0, comments: 0 });
  }

  likes.forEach(l => {
    const dateStr = new Date(l.createdAt).toISOString().split('T')[0];
    if (map.has(dateStr)) {
      map.get(dateStr)!.likes++;
    }
  });

  comments.forEach(c => {
    const dateStr = new Date(c.createdAt).toISOString().split('T')[0];
    if (map.has(dateStr)) {
      map.get(dateStr)!.comments++;
    }
  });

  // Format date for display (e.g., "Jan 20")
  return Array.from(map.values()).map(item => {
    const date = new Date(item.date);
    return {
      ...item,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
}