import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  bio: z.string().optional(),
  avatar: z.string().url('Invalid URL').or(z.literal('')).optional(),
  // Add other fields a user can update, e.g., location, website
});

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Gets the profile of the authenticated user
 *     description: Retrieves the user's profile data based on their JWT.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile data.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Return user data, excluding the password
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json(userWithoutPassword);
}

/**
 * @swagger
 * /api/v1/profile:
 *   put:
 *     summary: Updates the profile of the authenticated user
 *     description: Updates the user's profile data based on their JWT.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       401:
 *         description: Unauthorized.
 */
export async function PUT(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = updateProfileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validation.data,
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return NextResponse.json(userWithoutPassword);
}
