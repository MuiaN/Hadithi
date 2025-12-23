import { NextResponse } from 'next/server';
import { subscriptionTiersData } from '@/lib/subscriptions';

/**
 * @swagger
 * /api/v1/subscriptions/tiers:
 *   get:
 *     summary: Retrieves all available subscription tiers
 *     description: Fetches a list of all subscription plans and their features.
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: A list of subscription tiers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bronze:
 *                   $ref: '#/components/schemas/SubscriptionTier'
 *                 silver:
 *                   $ref: '#/components/schemas/SubscriptionTier'
 *                 gold:
 *                   $ref: '#/components/schemas/SubscriptionTier'
 */
export async function GET() {
  return NextResponse.json(subscriptionTiersData);
}