import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/v1/settings:
 *   get:
 *     summary: Gets the settings of the authenticated user
 *     description: Retrieves the user's settings data based on their JWT.
 *     tags: [Users, Settings]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User settings data.
 *       401:
 *         description: Unauthorized.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  // If no settings exist, return a default structure
  if (!settings) {
    return NextResponse.json({});
  }

  return NextResponse.json(settings);
}

/**
 * @swagger
 * /api/v1/settings:
 *   put:
 *     summary: Updates the settings of the authenticated user
 *     description: Updates the user's settings data based on their JWT.
 *     tags: [Users, Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully.
 *       401:
 *         description: Unauthorized.
 */
export async function PUT(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const updatedSettings = await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: body,
    create: {
      userId: user.id,
      ...body,
    },
  });

  return NextResponse.json(updatedSettings);
}