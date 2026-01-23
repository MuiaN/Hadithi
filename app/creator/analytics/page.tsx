'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  Calendar,
  BarChart3,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';

// Type definitions
interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  contentCount: number;
  topContent: ContentItem[];
  statusBreakdown: { status: string; count: number }[];
  typeBreakdown: { type: string; count: number }[];
  history: { date: string; likes: number; comments: number; content: number }[];
}

interface ContentItem {
  id: string;
  title: string;
  coverImage: string | null;
  views: number;
  rejectionReason: string | null; // Added rejectionReason
  series?: {
    id: string;
    title: string;
  } | null;
  chapterNumber?: number;
  _count: { likes: number };
}

export default function CreatorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    contentCount: 0,
    topContent: [],
    statusBreakdown: [],
    typeBreakdown: [],
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const { user } = useStore();

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/creator/analytics?range=${timeRange}`);
        if (!res.ok) throw new Error('Failed to load analytics');
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: '#22c55e', // Green
    DRAFT: '#eab308',     // Yellow
    PENDING_APPROVAL: '#3b82f6', // Blue
    REJECTED: '#ef4444',  // Red
    ARCHIVED: '#6b7280'   // Gray
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
              Analytics
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Track your content performance and engagement
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Views
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatNumber(analytics.totalViews)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +12% this month
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Eye size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Likes
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {formatNumber(analytics.totalLikes)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +8% this month
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Heart size={24} style={{ color: 'var(--color-error)' }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Comments
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.totalComments}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                +5 this week
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <MessageCircle size={24} style={{ color: 'var(--color-info)' }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Published
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {analytics.contentCount}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                Total content
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <BarChart3 size={24} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Engagement History */}
        <div className="p-6 rounded-lg col-span-1 lg:col-span-2" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Engagement Over Time
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="var(--color-textSecondary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="var(--color-textSecondary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-textPrimary)' }}
                  labelFormatter={formatDate}
                />
                <Legend />
                <Line type="monotone" dataKey="likes" name="Likes" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="comments" name="Comments" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Status Distribution */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Content Status
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {analytics.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-textPrimary)' }}
                  formatter={(value: number, name: string) => [value, formatStatus(name)]}
                />
                <Legend formatter={(value) => formatStatus(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Creation History */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Content Created
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="var(--color-textSecondary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="var(--color-textSecondary)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-textPrimary)' }}
                  labelFormatter={formatDate}
                />
                <Bar dataKey="content" name="New Content" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Top Performing Content
          </h2>
          <div className="space-y-4">
            {analytics.topContent.map((item: ContentItem, index: number) => (
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
                    {item.series && (
                      <span className="ml-2 text-sm font-medium text-gray-500">
                        ({item.series.title}
                        {item.chapterNumber && ` - Chapter ${item.chapterNumber}`})
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textSecondary)' }}>
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