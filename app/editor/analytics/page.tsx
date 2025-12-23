'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  FileText, 
  Eye, 
  Heart, 
  MessageCircle,
  Calendar,
  Filter
} from 'lucide-react';
import Image from 'next/image';

interface AnalyticsData {
  totalContent: number;
  publishedContent: number;
  totalViews: number;
  pendingReview: number;
  topContent: ContentItem[];
  reviewStats: { approved: number; rejected: number; pending: number };
}

interface ContentItem {
  id: string;
  title: string;
  coverImage: string | null;
  views: number;
  author: { name: string };
  _count: { likes: number };
}

export default function EditorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalContent: 0,
    publishedContent: 0,
    totalViews: 0,
    pendingReview: 0,
    topContent: [],
    reviewStats: { approved: 0, rejected: 0, pending: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Fetch from the new dedicated analytics endpoint
        const res = await fetch(`/api/v1/editor/analytics?range=${timeRange}`);
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
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
              Editorial Analytics
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Track content performance and editorial workflow
            </p>
          </div>
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
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Content
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.totalContent}
              </p>
            </div>
            <FileText size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Published
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.publishedContent}
              </p>
            </div>
            <TrendingUp size={24} style={{ color: 'var(--color-success)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Views
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatNumber(analytics.totalViews)}
              </p>
            </div>
            <Eye size={24} style={{ color: 'var(--color-info)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Pending Review
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.pendingReview}
              </p>
            </div>
            <MessageCircle size={24} style={{ color: 'var(--color-warning)' }} />
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Review Stats */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Review Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Approved</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-success)',
                      width: `${analytics.totalContent > 0 ? (analytics.reviewStats.approved / analytics.totalContent) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                  {analytics.reviewStats.approved}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-warning)',
                      width: `${analytics.totalContent > 0 ? (analytics.reviewStats.pending / analytics.totalContent) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                  {analytics.reviewStats.pending}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Rejected</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-error)',
                      width: `${analytics.totalContent > 0 ? (analytics.reviewStats.rejected / analytics.totalContent) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                  {analytics.reviewStats.rejected}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Top Performing Content
          </h2>
          <div className="space-y-4">
            {analytics.topContent.slice(0, 5).map((item: ContentItem, index: number) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  {index + 1}
                </div>
                <Image
                  src={item.coverImage || '/images/placeholder.png'}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-1" style={{ color: 'var(--color-textPrimary)' }}>
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                    <span>By {item.author.name}</span>
                    <span className="flex items-center space-x-1">
                      <Eye size={10} />
                      <span>{formatNumber(item.views)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart size={10} />
                      <span>{formatNumber(item._count.likes)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}