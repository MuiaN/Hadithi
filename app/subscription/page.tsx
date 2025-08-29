'use client';

import { useState, useEffect } from 'react';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield,
  CreditCard,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { subscriptionApi } from '@/lib/api/subscriptionApi';
import useStore from '@/lib/store/useStore';

export default function SubscriptionPage() {
  const [tiers, setTiers] = useState<any>({});
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const { user, isAuthenticated, setUser } = useStore();

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        const [tiersData, userSub] = await Promise.all([
          subscriptionApi.getSubscriptionTiers(),
          user ? subscriptionApi.getUserSubscription(user.id) : null
        ]);

        setTiers(tiersData);
        setCurrentSubscription(userSub);
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, [user]);

  const handleUpgrade = async (tierName: string) => {
    if (!user) return;

    setUpgrading(tierName);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedSubscription = await subscriptionApi.updateSubscription(user.id, tierName);
      setCurrentSubscription(updatedSubscription);
      
      // Update user in store
      setUser({ ...user, subscription: tierName });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    } finally {
      setUpgrading(null);
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'bronze':
        return <Shield className="text-orange-600" size={24} />;
      case 'silver':
        return <Star className="text-gray-600" size={24} />;
      case 'gold':
        return <Crown className="text-yellow-600" size={24} />;
      default:
        return <Zap className="text-blue-600" size={24} />;
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'bronze':
        return 'from-orange-500 to-orange-600';
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const isCurrentTier = (tierName: string) => {
    return currentSubscription?.tier === tierName;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Choose Your Plan
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Unlock premium African stories and cultural content with our subscription plans
          </p>
        </div>

        {/* Current Subscription Status */}
        {isAuthenticated && currentSubscription && (
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getTierIcon(currentSubscription.tier)}
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                    Current Plan: {currentSubscription.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    {currentSubscription.tier === 'free' 
                      ? 'Enjoy free access to basic content'
                      : `Next billing: ${new Date(currentSubscription.endDate).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
              {currentSubscription.tier !== 'free' && (
                <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-success)' }}>
                  <Calendar size={16} />
                  <span>Active</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(tiers).map(([tierName, tier]: [string, any]) => (
            <div
              key={tierName}
              className={`relative p-6 rounded-lg shadow-lg transition-transform hover:scale-105 ${
                isCurrentTier(tierName) ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                ...(isCurrentTier(tierName) && { 
                  borderColor: 'var(--color-primary)',
                  boxShadow: `0 0 0 2px var(--color-primary)20`
                })
              }}
            >
              {tierName === 'gold' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="mb-4">
                  {getTierIcon(tierName)}
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {tier.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                    ${tier.price}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      /month
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6 text-left">
                  {tier.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {isAuthenticated ? (
                  isCurrentTier(tierName) ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-lg font-medium text-sm opacity-50 cursor-not-allowed"
                      style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textSecondary)' }}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tierName)}
                      disabled={upgrading === tierName}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${
                        tierName === 'free' 
                          ? 'border-2' 
                          : 'text-white'
                      }`}
                      style={{
                        backgroundColor: tierName === 'free' 
                          ? 'transparent' 
                          : 'var(--color-primary)',
                        borderColor: tierName === 'free' 
                          ? 'var(--color-border)' 
                          : 'transparent',
                        color: tierName === 'free' 
                          ? 'var(--color-textPrimary)' 
                          : 'white'
                      }}
                    >
                      {upgrading === tierName ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>
                            {tierName === 'free' ? 'Downgrade' : 'Upgrade'}
                          </span>
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => window.location.href = '/auth/register'}
                    className="w-full py-3 px-4 rounded-lg font-medium text-sm text-white transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--color-textPrimary)' }}>
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                Can I change my plan anytime?
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                What payment methods do you accept?
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                We accept all major credit cards, PayPal, and mobile money payments.
              </p>
            </div>
            
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                Is there a free trial?
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Yes, all paid plans come with a 7-day free trial. Cancel anytime during the trial period.
              </p>
            </div>
            
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                Can I cancel my subscription?
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Yes, you can cancel your subscription at any time. You&apos;ll retain access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}