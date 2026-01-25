import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ContentStatus } from '@prisma/client';
import { getAuth } from '@/lib/auth';

const updateStatusSchema = z.object({
  status: z.nativeEnum(ContentStatus),
});

/**
 * @swagger
 * /api/v1/editor/content/{id}/status:
 *   put:
 *     summary: Updates the status of a content item
 *     description: Allows an editor to change the status (e.g., DRAFT, PUBLISHED, ARCHIVED).
 *     tags: [Editor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/ContentStatus'
 *     responses:
 *       200:
 *         description: Status updated successfully.
 *       400:
 *         description: Invalid input.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuth(req);
  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();
  const validation = updateStatusSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
  }

  const { status } = validation.data;

  const updatedContent = await prisma.content.update({
    where: { id },
    data: {
      status,
      // Automatically set publishedAt date if status is PUBLISHED
      ...(status === 'PUBLISHED' && { publishedAt: new Date() }),
    },
  });

  return NextResponse.json(updatedContent);
}
