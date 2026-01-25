import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Aggregate content stats
    const contentStats = await prisma.content.aggregate({
      _sum: {
        views: true,
      },
      _count: {
        id: true,
      },
    });

    // Aggregate user stats
    const userCount = await prisma.user.count();

    // Aggregate subscription stats
    const activeSubscribers = await prisma.userSubscription.count({
      where: {
        status: 'ACTIVE',
      },
    });

    const overview = {
      totalViews: contentStats._sum.views ?? 0,
      totalLikes: (contentStats._sum as any).likes ?? 0,
      totalContent: contentStats._count.id ?? 0,
      totalUsers: userCount,
      activeSubscribers: activeSubscribers,
      engagementRate:
        contentStats._sum.views && contentStats._sum.views > 0
          ? Math.round(
              (((contentStats._sum as any).likes ?? 0) / contentStats._sum.views) * 100
            )
          : 0,
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}