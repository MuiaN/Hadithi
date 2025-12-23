'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  Eye, 
  Clock, 
  User, 
  Settings, 
  Crown,
  TrendingUp,
  Calendar,
  MessageCircle
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  author: { name: string };
  status: string;
  publishedAt: string | null;
  createdAt: string;
  views: number;
  likes: number;
  coverImage: string;
  description: string;
  readingTime: string;
}

interface Subscription {
  tier: string;
  name: string;
  features?: string[];
}

export default function UserDashboard() {
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [userStats, setUserStats] = useState({
    articlesRead: 0,
    timeSpent: 0,
    favorites: 0,
    comments: 0,
    articlesReadThisMonth: 0
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user, likedContent } = useStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch recent content, user's subscription, and user stats
        const [recentDataRes, userSubRes, userStatsRes] = await Promise.all([
          fetch(`/api/v1/editor/content?limit=6`), // Using editor content as a placeholder for now
          user ? fetch(`/api/v1/user/subscription`) : Promise.resolve(null),
          user ? fetch(`/api/v1/user/stats`) : Promise.resolve(null)
        ]);
        
        const recentData = await recentDataRes.json();
        setRecentContent(recentData);
        
        if (userSubRes && userSubRes.ok) {
          const userSub = await userSubRes.json();
          setSubscription(userSub);
        }

        if (userStatsRes && userStatsRes.ok) {
          const statsData = await userStatsRes.json();
          setUserStats(statsData);
        } else {
          // Fallback to likedContent length if stats API fails
          setUserStats(prev => ({ ...prev, favorites: likedContent.length }));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, likedContent]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                Welcome back, {user?.name}!
              </h1>
              <p style={{ color: 'var(--color-textSecondary)' }}>
                Continue your journey through African stories and culture
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Read</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {userStats.articlesRead}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-textTertiary)' }}>Articles</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={16} style={{ color: 'var(--color-chart2)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Time</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {formatTime(userStats.timeSpent)}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-textTertiary)' }}>Reading</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <Heart size={16} style={{ color: 'var(--color-error)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Liked</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {userStats.favorites}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-textTertiary)' }}>Stories</p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle size={16} style={{ color: 'var(--color-info)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Comments</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {userStats.comments}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-textTertiary)' }}>Posted</p>
              </div>
            </div>

            {/* Recent Content */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Continue Reading
                </h2>
                <Link 
                  href="/stories" 
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentContent.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/content/${item.id}`}
                    className="group block p-4 rounded-lg transition-shadow hover:shadow-md"
                    style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex space-x-4">
                      <Image 
                        src={item.coverImage} 
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium group-hover:text-amber-600 transition-colors line-clamp-2 mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                          {item.title}
                        </h3>
                        <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                          <span className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{item.readingTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye size={12} />
                            <span>{item.views}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center space-x-3 mb-4">
                <Crown size={20} style={{ color: 'var(--color-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                  Subscription
                </h3>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3" 
                     style={{ 
                       backgroundColor: subscription?.tier === 'free' ? 'var(--color-backgroundSecondary)' : 'var(--color-primary)20',
                       color: subscription?.tier === 'free' ? 'var(--color-textSecondary)' : 'var(--color-primary)'
                     }}>
                  {subscription?.name || 'Free'} Plan
                </div>
                
                {subscription?.tier !== 'free' && (
                  <p className="text-sm mb-3" style={{ color: 'var(--color-textSecondary)' }}>
                    {subscription?.features?.length || 0} features included
                  </p>
                )}
                
                <Link
                  href="/dashboard/subscription"
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'white'
                  }}
                >
                  {subscription?.tier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}
                >
                  <User size={16} style={{ color: 'var(--color-textSecondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>Edit Profile</span>
                </Link>
                
                <Link
                  href="/dashboard/favorites"
                  className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}
                >
                  <Heart size={16} style={{ color: 'var(--color-textSecondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>My Favorites</span>
                </Link>
                
                <Link
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}
                >
                  <Settings size={16} style={{ color: 'var(--color-textSecondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>Settings</span>
                </Link>
              </div>
            </div>

            {/* Reading Progress */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                This Month
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Reading Goal</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>{userStats.articlesReadThisMonth || 0}/30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: 'var(--color-primary)', 
                        width: `${((userStats.articlesReadThisMonth || 0) / 30) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--color-textSecondary)' }}>Streak</span>
                  <span className="font-medium" style={{ color: 'var(--color-primary)' }}>7 days 🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}