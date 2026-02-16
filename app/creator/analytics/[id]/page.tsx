'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  MessageCircle, 
  Calendar, 
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalyticsData {
  type: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  publishedAt: string | null;
  status: string;
  engagementHistory: {
    date: string;
    displayDate: string;
    likes: number;
    comments: number;
  }[];
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`/api/v1/creator/analytics/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await res.json();
        setData(analyticsData);
      } catch (err) {
        console.error(err);
        setError('Could not load analytics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || 'Content not found'}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const engagementRate = data.views > 0 
    ? (((data.likes + data.comments) / data.views) * 100).toFixed(1) 
    : '0';

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center space-x-2 text-sm mb-4 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-textSecondary)' }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 uppercase">
                  {data.type}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                  data.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {data.title}
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              <Calendar size={16} />
              <span>
                {data.publishedAt 
                  ? `Published on ${new Date(data.publishedAt).toLocaleDateString()}`
                  : `Created on ${new Date(data.createdAt).toLocaleDateString()}`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Total Views</h3>
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <Eye size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{data.views.toLocaleString()}</p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Total Likes</h3>
              <div className="p-2 rounded-full bg-red-50 text-red-600">
                <Heart size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{data.likes.toLocaleString()}</p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Total Comments</h3>
              <div className="p-2 rounded-full bg-green-50 text-green-600">
                <MessageCircle size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{data.comments.toLocaleString()}</p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>Engagement Rate</h3>
              <div className="p-2 rounded-full bg-purple-50 text-purple-600">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>{engagementRate}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>Likes + Comments / Views</p>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="p-6 rounded-lg border mb-8" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-textPrimary)' }}>Engagement Over Time (Last 30 Days)</h2>
            <BarChart2 size={20} style={{ color: 'var(--color-textSecondary)' }} />
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.engagementHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
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
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  name="Likes" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  name="Comments" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
