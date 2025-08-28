import { subscriptionTiers, userSubscriptions } from '@/lib/mockData/subscriptions';
import { users } from '@/lib/mockData/users';
import { apiClient } from './index';

export const subscriptionApi = {
  async getSubscriptionTiers() {
    await apiClient.delay();
    return subscriptionTiers;
  },

  async getUserSubscription(userId) {
    await apiClient.delay();
    
    const userSub = userSubscriptions.find(sub => sub.userId === userId);
    if (!userSub) {
      return {
        tier: 'free',
        status: 'active',
        ...subscriptionTiers.free
      };
    }

    return {
      ...userSub,
      ...subscriptionTiers[userSub.tier]
    };
  },

  async updateSubscription(userId, tierName) {
    await apiClient.delay();
    
    if (!subscriptionTiers[tierName]) {
      throw new Error('Invalid subscription tier');
    }

    let userSub = userSubscriptions.find(sub => sub.userId === userId);
    
    if (userSub) {
      // Update existing subscription
      userSub.tier = tierName;
      userSub.status = 'active';
      userSub.startDate = new Date().toISOString();
      userSub.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now
      userSub.autoRenew = true;
    } else {
      // Create new subscription
      userSub = {
        userId,
        tier: tierName,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      };
      userSubscriptions.push(userSub);
    }

    // Update user's subscription in users array
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].subscription = tierName;
    }

    return {
      ...userSub,
      ...subscriptionTiers[tierName]
    };
  },

  async cancelSubscription(userId) {
    await apiClient.delay();
    
    const userSub = userSubscriptions.find(sub => sub.userId === userId);
    if (!userSub) {
      throw new Error('No active subscription found');
    }

    userSub.status = 'cancelled';
    userSub.autoRenew = false;

    // Update user's subscription in users array to free
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].subscription = null;
    }

    return {
      message: 'Subscription cancelled successfully',
      subscription: userSub
    };
  },

  async getSubscriptionStats() {
    await apiClient.delay();
    
    const stats = {
      totalSubscribers: userSubscriptions.length,
      activeSubscribers: userSubscriptions.filter(sub => sub.status === 'active').length,
      byTier: {
        bronze: userSubscriptions.filter(sub => sub.tier === 'bronze' && sub.status === 'active').length,
        silver: userSubscriptions.filter(sub => sub.tier === 'silver' && sub.status === 'active').length,
        gold: userSubscriptions.filter(sub => sub.tier === 'gold' && sub.status === 'active').length
      },
      revenue: {
        monthly: userSubscriptions
          .filter(sub => sub.status === 'active')
          .reduce((total, sub) => total + subscriptionTiers[sub.tier].price, 0)
      }
    };

    return stats;
  },

  // Mock Stripe integration
  async createPaymentIntent(userId, tierName) {
    await apiClient.delay();
    
    const tier = subscriptionTiers[tierName];
    if (!tier) {
      throw new Error('Invalid subscription tier');
    }

    // Mock payment intent
    return {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret`,
      amount: tier.price * 100, // Convert to cents
      currency: tier.currency.toLowerCase(),
      status: 'requires_payment_method'
    };
  },

  async confirmPayment(paymentIntentId, userId, tierName) {
    await apiClient.delay();
    
    // Mock payment confirmation
    const success = Math.random() > 0.1; // 90% success rate
    
    if (!success) {
      throw new Error('Payment failed. Please try again.');
    }

    // Update subscription on successful payment
    await this.updateSubscription(userId, tierName);

    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: subscriptionTiers[tierName].price * 100
    };
  }
};