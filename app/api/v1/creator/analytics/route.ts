import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/creator/analytics:
 *   get:
 *     summary: Retrieves analytics for the authenticated creator
 *     description: Fetches aggregated statistics for the creator's content.
 *     tags: [Creator, Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Creator analytics data.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '30d';

  const now = new Date();
  const startDate = new Date();
  if (range === '7d') startDate.setDate(now.getDate() - 7);
  else if (range === '90d') startDate.setDate(now.getDate() - 90);
  else startDate.setDate(now.getDate() - 30); // Default 30d

  // 1. Aggregate Stats (All Time)
  const stats = await prisma.content.aggregate({
    where: { authorId: user.id },
    _sum: { views: true },
    _count: { _all: true },
  });

  const totalLikes = await prisma.like.count({
    where: { content: { authorId: user.id } },
  });

  const totalComments = await prisma.comment.count({
    where: { content: { authorId: user.id } },
  });

  // 2. Status Breakdown
  const statusCounts = await prisma.content.groupBy({
    by: ['status'],
    where: { authorId: user.id },
    _count: { _all: true },
  });

  // 3. Type Breakdown
  const typeCounts = await prisma.content.groupBy({
    by: ['type'],
    where: { authorId: user.id },
    _count: { _all: true },
  });

  // 4. Top Content
  const topContent = await prisma.content.findMany({
    where: { authorId: user.id, status: 'PUBLISHED' },
    orderBy: { views: 'desc' },
    take: 5,
    select: { id: true, title: true, coverImage: true, views: true, _count: { select: { likes: true } }, series: { select: { title: true } }, chapterNumber: true },
  });

  // 5. Historical Data (Engagement & Creation)
  const likes = await prisma.like.findMany({
    where: { 
      content: { authorId: user.id },
      createdAt: { gte: startDate }
    },
    select: { createdAt: true }
  });

  const comments = await prisma.comment.findMany({
    where: { 
      content: { authorId: user.id },
      createdAt: { gte: startDate }
    },
    select: { createdAt: true }
  });

  const contentCreated = await prisma.content.findMany({
    where: {
      authorId: user.id,
      createdAt: { gte: startDate }
    },
    select: { createdAt: true }
  });

  // Process History
  const historyMap = new Map<string, { date: string; likes: number; comments: number; content: number }>();
  
  // Initialize map with 0s for every day in range
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    historyMap.set(key, { date: key, likes: 0, comments: 0, content: 0 });
  }

  likes.forEach(l => {
    const key = l.createdAt.toISOString().split('T')[0];
    if (historyMap.has(key)) historyMap.get(key)!.likes++;
  });
  comments.forEach(c => {
    const key = c.createdAt.toISOString().split('T')[0];
    if (historyMap.has(key)) historyMap.get(key)!.comments++;
  });
  contentCreated.forEach(c => {
    const key = c.createdAt.toISOString().split('T')[0];
    if (historyMap.has(key)) historyMap.get(key)!.content++;
  });

  const history = Array.from(historyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  const analyticsData = {
    totalViews: stats._sum.views || 0,
    totalLikes,
    totalComments,
    contentCount: stats._count._all,
    topContent,
    statusBreakdown: statusCounts.map(s => ({ status: s.status, count: s._count._all })),
    typeBreakdown: typeCounts.map(t => ({ type: t.type, count: t._count._all })),
    history,
  };

  return NextResponse.json(analyticsData);
}