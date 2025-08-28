// Mock subscription data
export const subscriptionTiers = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: null,
    features: [
      'Access to free articles and stories',
      'Basic commenting',
      'Community discussions',
      'Newsletter subscription'
    ],
    limits: {
      articlesPerMonth: null,
      downloadable: false,
      premium: false
    }
  },
  bronze: {
    name: 'Bronze',
    price: 9.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All free features',
      'Access to Bronze tier content',
      'Download articles as PDF',
      'Early access to new stories',
      'Ad-free reading experience'
    ],
    limits: {
      articlesPerMonth: 25,
      downloadable: true,
      premium: true
    }
  },
  silver: {
    name: 'Silver',
    price: 19.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All Bronze features',
      'Access to Silver tier content',
      'Audio versions of stories',
      'Exclusive webinars',
      'Priority customer support'
    ],
    limits: {
      articlesPerMonth: 50,
      downloadable: true,
      premium: true
    }
  },
  gold: {
    name: 'Gold',
    price: 39.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All Silver features',
      'Access to all premium content',
      'Video documentaries',
      'Direct access to authors',
      'Exclusive events and workshops',
      'Content creation tools'
    ],
    limits: {
      articlesPerMonth: null,
      downloadable: true,
      premium: true
    }
  }
};

export const userSubscriptions = [
  {
    userId: '1',
    tier: 'gold',
    status: 'active',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-12-31T23:59:59.000Z',
    autoRenew: true
  },
  {
    userId: '2',
    tier: 'silver',
    status: 'active',
    startDate: '2024-01-15T00:00:00.000Z',
    endDate: '2024-12-15T23:59:59.000Z',
    autoRenew: true
  },
  {
    userId: '3',
    tier: 'bronze',
    status: 'active',
    startDate: '2024-02-01T00:00:00.000Z',
    endDate: '2024-11-01T23:59:59.000Z',
    autoRenew: false
  },
  {
    userId: '4',
    tier: 'bronze',
    status: 'active',
    startDate: '2024-02-15T00:00:00.000Z',
    endDate: '2024-11-15T23:59:59.000Z',
    autoRenew: true
  }
];