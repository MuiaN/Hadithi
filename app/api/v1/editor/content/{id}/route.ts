import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  // Add other fields an editor can modify
});

/**
 * @swagger
 * /api/v1/editor/content/{id}:
 *   put:
 *     summary: Updates a piece of content
 *     description: Allows an editor to update the details of a specific content item.
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
 *             $ref: '#/components/schemas/UpdateContent'
 *     responses:
 *       200:
 *         description: Content updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Content not found.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const validation = updateContentSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const updatedContent = await prisma.content.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json(updatedContent);
}
