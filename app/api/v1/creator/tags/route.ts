import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { ContentType } from '@prisma/client';

/**
 * @swagger
 * /api/v1/creator/tags:
 *   get:
 *     summary: Retrieves all unique tags
 *     description: Fetches a list of all unique tags available in the system for autocomplete.
 *     tags: [Creator, Tags]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/ContentType'
 *         description: Optional. Filter tags by the type of content they are associated with.
 *     responses:
 *       200:
 *         description: A list of tag names.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get('type')?.toUpperCase() as ContentType | null;

  try {
    const tags = await prisma.tag.findMany({
      where: typeFilter
        ? {
            content: {
              some: {
                type: typeFilter,
              },
            },
          }
        : undefined,
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(tags.map((t: { name: string }) => t.name));
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
