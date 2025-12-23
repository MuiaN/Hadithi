import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z } from 'zod';

const createSeriesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(191, 'Title is too long'),
  description: z.string().optional().nullable(),
});

/**
 * @swagger
 * /api/v1/creator/series:
 *   get:
 *     summary: Retrieves all series for the authenticated creator
 *     description: Fetches a list of all series authored by the currently logged-in creator.
 *     tags: [Creator, Series]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of the creator's series.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Series'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') { // This check was correct, ensuring it's enforced.
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const series = await prisma.series.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        title: 'asc',
      },
    });
    return NextResponse.json(series);
  } catch (error) {
    console.error('Failed to fetch series:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/creator/series:
 *   post:
 *     summary: Creates a new series
 *     description: Allows an authenticated creator to create a new series.
 *     tags: [Creator, Series]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Series created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
export async function POST(req: NextRequest) {
  const user = await getAuth(req);
  if (!user || user.role !== 'CREATOR') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = createSeriesSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { title, description } = validation.data;

  try {
    const newSeries = await prisma.series.create({
      data: {
        title,
        description,
        authorId: user.id,
      },
    });
    return NextResponse.json(newSeries, { status: 201 });
  } catch (error) {
    console.error('Failed to create series:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}