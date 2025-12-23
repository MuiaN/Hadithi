import { SubscriptionTier } from '@prisma/client';

export const subscriptionTiersData = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: null,
    features: ['Access to free articles and stories', 'Basic commenting', 'Community discussions'],
  },
  BRONZE: {
    name: 'Bronze',
    price: 9.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['All free features', 'Access to Bronze tier content', 'Download articles as PDF', 'Ad-free reading'],
  },
  SILVER: {
    name: 'Silver',
    price: 19.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['All Bronze features', 'Access to Silver tier content', 'Audio versions of stories', 'Exclusive webinars'],
  },
  GOLD: {
    name: 'Gold',
    price: 39.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['All Silver features', 'Access to all premium content', 'Video documentaries', 'Direct access to authors'],
  },
};