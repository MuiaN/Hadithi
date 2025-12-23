import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. Users Stats
    const totalUsers = await prisma.user.count();
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // 2. Content Stats
    const totalContent = await prisma.content.count();
    const publishedContent = await prisma.content.count({
      where: {
        status: 'PUBLISHED',
      },
    });
    const draftContent = await prisma.content.count({
      where: {
        status: 'DRAFT',
      },
    });

    // 3. Subscription Stats
    const totalSubscriptions = await prisma.userSubscription.count({
      where: {
        status: 'ACTIVE',
      },
    });
    
    // Calculate estimated revenue based on active subscriptions
    // Bronze: $9.99, Silver: $19.99, Gold: $29.99
    const subscriptions = await prisma.userSubscription.findMany({
      where: { status: 'ACTIVE' },
      select: { tier: true }
    });
    
    const revenue = subscriptions.reduce((acc, sub) => {
      switch (sub.tier) {
        case 'BRONZE': return acc + 9.99;
        case 'SILVER': return acc + 19.99;
        case 'GOLD': return acc + 29.99;
        default: return acc;
      }
    }, 0);

    // 4. Engagement Stats
    const contentStats = await prisma.content.aggregate({
      _sum: {
        views: true,
      },
    });
    const totalLikes = await prisma.like.count();
    const totalComments = await prisma.comment.count();

    // 5. Recent Content
    const recentContentRaw = await prisma.content.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    const recentContent = recentContentRaw.map(item => ({
      id: item.id,
      title: item.title,
      coverImage: item.coverImage,
      author: item.author,
      createdAt: item.createdAt,
      views: item.views,
      likes: item._count.likes,
      status: item.status.toLowerCase(),
    }));

    // 6. Recent Users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const responseData = {
      users: {
        total: totalUsers,
        new: newUsers,
      },
      content: {
        total: totalContent,
        published: publishedContent,
        draft: draftContent,
      },
      subscriptions: {
        total: totalSubscriptions,
        revenue: revenue,
      },
      engagement: {
        views: contentStats._sum.views ?? 0,
        likes: totalLikes,
        comments: totalComments,
      },
      recentContent: recentContent,
      recentUsers: recentUsers,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
