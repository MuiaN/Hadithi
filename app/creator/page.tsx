'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  views: number;
  likes: number;
  coverImage: string;
  description: string;
}
export default function CreatorDashboard() {
  const [myContent, setMyContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    inReview: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'creator') {
      router.push('/');
      return;
    }

    const loadCreatorData = async () => {
      try {
        const contentData = await contentApi.getAllContent({ 
          author: user?.id,
          includeUnpublished: true
        });
        
        const content = contentData.content;
        setMyContent(content);
        
        // Calculate stats
        const published = content.filter((c: ContentItem) => c.status === 'published');
        const draft = content.filter((c: ContentItem) => c.status === 'draft');
        const inReview = content.filter((c: ContentItem) => c.status === 'in-review');
        const totalViews = content.reduce((sum: number, c: ContentItem) => sum + c.views, 0);
        const totalLikes = content.reduce((sum: number, c: ContentItem) => sum + c.likes, 0);
        
        setStats({
          total: content.length,
          published: published.length,
          draft: draft.length,
          inReview: inReview.length,
          totalViews,
          totalLikes
        });
      } catch (error) {
        console.error('Error loading creator data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, [isAuthenticated, user, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'draft':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'in-review':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      case 'in-review':
        return 'In Review';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
                Creator Dashboard
              </h1>
              <p style={{ color: 'var(--color-textSecondary)' }}>
                Manage your content and track your impact
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                <Calendar size={16} />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <button
                onClick={() => router.push('/creator/new')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <Plus size={16} />
                <span>New Content</span>
              </button>
            </div>
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
                  {stats.total}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <FileText size={24} style={{ color: 'var(--color-primary)' }} />
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
                  {stats.published}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Total Views
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <Eye size={24} style={{ color: 'var(--color-info)' }} />
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
                  {stats.totalLikes.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <CheckCircle size={24} style={{ color: 'var(--color-error)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>
              My Content
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                {stats.inReview} pending review
              </span>
            </div>
          </div>

          {myContent.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                No content yet
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
                Start creating your first piece of content to share with the community.
              </p>
              <button
                onClick={() => router.push('/creator/new')}
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                Create Your First Content
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myContent.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:shadow-sm"
                  style={{ backgroundColor: 'var(--color-backgroundSecondary)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <img 
                      src={item.coverImage} 
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(item.status)}
                        <span className="text-xs font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                          {getStatusText(item.status)}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                          {item.type}
                        </span>
                      </div>
                      <h3 className="font-medium mb-1 line-clamp-1" style={{ color: 'var(--color-textPrimary)' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                        <span>Created {formatDate(item.createdAt)}</span>
                        {item.publishedAt && (
                          <span>Published {formatDate(item.publishedAt)}</span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{item.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => router.push(`/creator/edit/${item.id}`)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-textSecondary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-backgroundTertiary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this content?')) {
                          // Handle delete
                        }
                      }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-error)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-error)10';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}