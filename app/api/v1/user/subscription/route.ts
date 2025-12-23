import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { z } from 'zod';
import { SubscriptionTier } from '@prisma/client';
import { subscriptionTiersData } from '@/lib/subscriptions';

const updateSubscriptionSchema = z.object({
  tierName: z.union([z.nativeEnum(SubscriptionTier), z.literal('free')]),
});

/**
 * @swagger
 * /api/v1/user/subscription:
 *   get:
 *     summary: Retrieves the authenticated user's subscription
 *     description: Fetches the current subscription details for the logged-in user.
 *     tags: [Users, Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: The user's subscription object.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: No subscription found, defaults to free.
 */
export async function GET(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription) {
    return NextResponse.json({ tier: 'free', name: 'Free' });
  }

  // Include tier details in the response
  const tierDetails = subscriptionTiersData[subscription.tier];
  return NextResponse.json({
    ...subscription,
    ...tierDetails,
  });
}

/**
 * @swagger
 * /api/v1/user/subscription:
 *   post:
 *     summary: Creates or updates a user's subscription
 *     description: Simulates upgrading a user's subscription tier.
 *     tags: [Users, Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tierName:
 *                 $ref: '#/components/schemas/SubscriptionTier'
 *     responses:
 *       200:
 *         description: Subscription updated successfully.
 *       401:
 *         description: Unauthorized.
 */
export async function POST(req: NextRequest) {
  const user = await getAuth(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = updateSubscriptionSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ message: 'Invalid tier name' }, { status: 400 });
  }

  const { tierName } = validation.data;

  // Handle downgrade to 'free' by deleting the subscription record
  if (tierName === 'free') {
    await prisma.userSubscription.delete({
      where: { userId: user.id },
    });
    return NextResponse.json({
      tier: 'free',
      name: 'Free',
      message: 'Subscription cancelled successfully.',
    });
  }

  const now = new Date();
  const endDate = new Date(now.setMonth(now.getMonth() + 1));

  const updatedSubscription = await prisma.userSubscription.upsert({
    where: { userId: user.id },
    update: { tier: tierName, status: 'ACTIVE', startDate: new Date(), endDate },
    create: { userId: user.id, tier: tierName, startDate: new Date(), endDate },
  });

  return NextResponse.json(updatedSubscription);
}