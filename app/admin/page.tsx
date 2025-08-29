'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Heart, 
  Clock, 
  Activity, 
  Shield, 
  AlertTriangle,
  Settings,
  MessageCircle,
  Calendar,
  Palette
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import { subscriptionApi } from '@/lib/api/subscriptionApi';
import useStore from '@/lib/store/useStore';
import { getAllThemes, getTheme } from '@/lib/themes';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { total: 0, new: 0 },
    content: { total: 0, published: 0, draft: 0 },
    subscriptions: { total: 0, revenue: 0 },
    engagement: { views: 0, likes: 0, comments: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);  

  const { user, currentTheme, setTheme } = useStore();
  const themes = getAllThemes();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [contentData, subscriptionStats] = await Promise.all([
          contentApi.getAllContent({ includeUnpublished: true }),
          subscriptionApi.getSubscriptionStats()
        ]);
        
        // Calculate content stats
        const publishedContent = contentData.content.filter((c: any) => c.status === 'published');
        const draftContent = contentData.content.filter((c: any) => c.status === 'draft');
        
        // Calculate engagement stats
        const totalViews = contentData.content.reduce((sum: number, c: any) => sum + c.views, 0);
        const totalLikes = contentData.content.reduce((sum: number, c: any) => sum + c.likes, 0);

        setStats({
          users: { 
            total: 150, // Mock data
            new: 23 
          },
          content: { 
            total: contentData.content.length,
            published: publishedContent.length,
            draft: draftContent.length
          },
          subscriptions: { 
            total: subscriptionStats.activeSubscribers,
            revenue: subscriptionStats.revenue.monthly
          },
          engagement: { 
            views: totalViews,
            likes: totalLikes,
            comments: 45 // Mock data
          }
        });

        // Get recent content
        const recent = contentData.content
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentContent(recent);

        // Mock recent users
        setRecentUsers([
          { id: '1', name: 'Amara Kone', email: 'amara@example.com', joinedAt: '2024-02-15T10:00:00.000Z' },
          { id: '2', name: 'Kwame Asante', email: 'kwame@example.com', joinedAt: '2024-02-14T15:30:00.000Z' },
          { id: '3', name: 'Fatima Okafor', email: 'fatima@example.com', joinedAt: '2024-02-13T09:15:00.000Z' }
        ]);

        // Mock recent activity
        setRecentActivity([
          { id: '1', type: 'user_registered', description: 'New user registration: Amina Hassan', timestamp: '2024-02-15T14:30:00.000Z' },
          { id: '2', type: 'content_published', description: 'Article published: "Modern African Literature"', timestamp: '2024-02-15T13:15:00.000Z' },
          { id: '3', type: 'subscription_upgraded', description: 'User upgraded to Gold tier', timestamp: '2024-02-15T12:45:00.000Z' },
          { id: '4', type: 'content_flagged', description: 'Content flagged for review', timestamp: '2024-02-15T11:20:00.000Z' }
        ]);        

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Users size={16} style={{ color: 'var(--color-success)' }} />;
      case 'content_published':
        return <FileText size={16} style={{ color: 'var(--color-info)' }} />;
      case 'subscription_upgraded':
        return <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'content_flagged':
        return <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <Activity size={16} style={{ color: 'var(--color-textSecondary)' }} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
  };

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Welcome back, {user?.name}. Here`&apos;s what`&apos;s happening with your platform.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Users
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatNumber(stats.users.total)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +{stats.users.new} this week
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Users size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Content
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {stats.content.total}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                {stats.content.published} published
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <FileText size={24} style={{ color: 'var(--color-chart2)' }} />
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatCurrency(stats.subscriptions.revenue)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                {stats.subscriptions.total} subscribers
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <DollarSign size={24} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Views
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatNumber(stats.engagement.views)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                {formatNumber(stats.engagement.likes)} likes
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <TrendingUp size={24} style={{ color: 'var(--color-info)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content and Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Content */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
              Recent Content
            </h2>
            <button className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentContent.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 p-4 rounded-lg hover:shadow-sm transition-shadow" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  width={64}
                  height={64}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate" style={{ color: 'var(--color-textPrimary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    By {item.author} • {formatDate(item.createdAt)}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                    <span className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>{formatNumber(item.views)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart size={12} />
                      <span>{formatNumber(item.likes)}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
              Recent Activity
            </h2>
            <Activity size={20} style={{ color: 'var(--color-primary)' }} />
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                    {activity.description}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-textTertiary)' }}>
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
              Recent Users
            </h2>
            <button className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 rounded-lg hover:shadow-sm transition-shadow" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" style={{ background: 'var(--gradient-primary)' }}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                    {user.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    {user.email}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                    Joined {formatDate(user.joinedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Theme Selector */}
          <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Palette size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
                Platform Theme
              </h3>
            </div>
            
            <div className="space-y-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    currentTheme === theme.name ? 'shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor: currentTheme === theme.name ? 'var(--color-primary)10' : 'var(--color-backgroundSecondary)',
                    borderColor: currentTheme === theme.name ? 'var(--color-primary)' : 'var(--color-border)'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.success }}
                      ></div>
                    </div>
                    <span className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                      {theme.displayName}
                    </span>
                  </div>
                  {currentTheme === theme.name && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}>
              <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                Theme changes apply instantly across the entire platform. To add new themes, create a file in <code>lib/themes/</code> and import it in the index.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/content"
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed transition-colors hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-textPrimary)' }}
              >
                <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                <span>Manage Content</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed transition-colors hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-textPrimary)' }}
              >
                <Users size={20} style={{ color: 'var(--color-chart2)' }} />
                <span>Manage Users</span>
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed transition-colors hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-textPrimary)' }}
              >
                <TrendingUp size={20} style={{ color: 'var(--color-success)' }} />
                <span>View Analytics</span>
              </Link>
              <Link
                href="/admin/themes"
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed transition-colors hover:shadow-md"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-textPrimary)' }}
              >
                <Palette size={20} style={{ color: 'var(--color-info)' }} />
                <span>Advanced Theme Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}  