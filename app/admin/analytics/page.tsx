'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Eye, 
  Heart, 
  MessageCircle,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import { subscriptionApi } from '@/lib/api/subscriptionApi';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 0,
      totalUsers: 0,
      totalContent: 0,
      engagement: 0
    },
    contentPerformance: [],
    userGrowth: [],
    subscriptionStats: {
      total: 0,
      byTier: { bronze: 0, silver: 0, gold: 0 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [contentData, subscriptionStats] = await Promise.all([
          contentApi.getAllContent({ includeUnpublished: true }),
          subscriptionApi.getSubscriptionStats()
        ]);

        // Calculate analytics
        const totalViews = contentData.content.reduce((sum: number, c: any) => sum + c.views, 0);
        const totalLikes = contentData.content.reduce((sum: number, c: any) => sum + c.likes, 0);
        
        // Mock user growth data
        const userGrowthData = [
          { month: 'Jan', users: 120 },
          { month: 'Feb', users: 150 },
          { month: 'Mar', users: 180 },
          { month: 'Apr', users: 220 },
          { month: 'May', users: 280 },
          { month: 'Jun', users: 350 }
        ];

        setAnalytics({
          overview: {
            totalViews,
            totalUsers: 350,
            totalContent: contentData.content.length,
            engagement: Math.round((totalLikes / totalViews) * 100) || 0
          },
          contentPerformance: contentData.content
            .sort((a: any, b: any) => b.views - a.views)
            .slice(0, 10),
          userGrowth: userGrowthData,
          subscriptionStats
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              Analytics Dashboard
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Track platform performance and user engagement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-inputBorder)',
                color: 'var(--color-textPrimary)'
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Views
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatNumber(analytics.overview.totalViews)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +12% from last month
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Eye size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Users
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.overview.totalUsers}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +8% from last month
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Users size={24} style={{ color: 'var(--color-chart2)' }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Content Published
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.overview.totalContent}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +5 this month
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <FileText size={24} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Engagement Rate
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.overview.engagement}%
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +2% from last month
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <TrendingUp size={24} style={{ color: 'var(--color-info)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            User Growth
          </h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.userGrowth.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${(data.users / 350) * 200}px`,
                    backgroundColor: 'var(--color-primary)',
                    minHeight: '20px'
                  }}
                ></div>
                <span className="text-xs mt-2" style={{ color: 'var(--color-textSecondary)' }}>
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Stats */}
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Subscription Distribution
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Bronze</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-warning)',
                      width: `${(analytics.subscriptionStats.byTier.bronze / analytics.subscriptionStats.total) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                  {analytics.subscriptionStats.byTier.bronze}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Silver</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-chart2)',
                      width: `${(analytics.subscriptionStats.byTier.silver / analytics.subscriptionStats.total) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                  {analytics.subscriptionStats.byTier.silver}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Gold</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      width: `${(analytics.subscriptionStats.byTier.gold / analytics.subscriptionStats.total) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                  {analytics.subscriptionStats.byTier.gold}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
          Top Performing Content
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Views
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Likes
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Engagement
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.contentPerformance.map((item: any) => (
                <tr key={item.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      {formatNumber(item.views)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      {formatNumber(item.likes)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm" style={{ color: 'var(--color-success)' }}>
                      {Math.round((item.likes / item.views) * 100) || 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}