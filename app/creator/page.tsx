'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  Search,
  Filter,
  Clock,
  Heart,
  LayoutGrid,
  List,
  BarChart2
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_APPROVAL' | 'REJECTED';
  publishedAt: string | null;
  createdAt: string;
  views: number;
  coverImage: string | null;
  description: string;
  rejectionReason: string | null;
  chapterNumber?: number;
  series?: {
    id: string;
    title: string;
  } | null;
  _count?: { likes: number };
}
export default function CreatorDashboard() {
  const [myContent, setMyContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadCreatorData = async () => {
      try {
        const contentRes = await fetch('/api/v1/creator/content');
        if (!contentRes.ok) throw new Error('Failed to load creator data');

        const contentData = await contentRes.json();
        setMyContent(contentData);
      } catch (error) {
        console.error('Error loading creator data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, []);

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/creator/content/${contentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete content');
      }

      // Update the state to reflect the change
      setMyContent(prevContent => prevContent.filter(item => item.id !== contentId));
      alert('Content deleted successfully.');
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content.');
    }
  };

  const filteredContent = useMemo(() => {
    let filtered = myContent;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [myContent, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: myContent.length,
    published: myContent.filter((c) => c.status === 'PUBLISHED').length,
    draft: myContent.filter((c) => c.status === 'DRAFT').length,
    inReview: myContent.filter((c) => c.status === 'PENDING_APPROVAL').length,
  }), [myContent]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle size={16} className="text-green-500" />; // Approved
      case 'PENDING_APPROVAL':
        return <Clock size={16} className="text-blue-500" />; // Pending approval
      case 'DRAFT':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'REJECTED':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Published'; // Approved
      case 'PENDING_APPROVAL':
        return 'Pending Approval'; // Pending approval
      case 'DRAFT':
        return 'Draft';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'text-green-600 bg-green-100';
      case 'DRAFT': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING_APPROVAL': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
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
                <FileText size={20} style={{ color: 'var(--color-primary)' }} />
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
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-success-background)' }}>
                <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  In Review
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {stats.inReview}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-info-background)' }}>
                <Clock size={20} style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Drafts
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {stats.draft}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--color-warning-background)' }}>
                <Edit size={20} style={{ color: 'var(--color-warning)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-textPrimary)' }}>My Content</h2>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border appearance-none"
                  style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="PENDING_APPROVAL">In Review</option>
                  <option value="DRAFT">Draft</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="flex items-center bg-[var(--color-input)] rounded-lg border border-[var(--color-inputBorder)] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-textSecondary)] hover:bg-[var(--color-backgroundSecondary)]'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-textSecondary)] hover:bg-[var(--color-backgroundSecondary)]'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                {myContent.length === 0 ? 'No content yet' : 'No content found'}
              </h3>
              <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
                {myContent.length === 0
                  ? 'Start creating your first piece of content to share with the community.'
                  : 'Try adjusting your search or filter criteria.'}
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
            viewMode === 'list' ? (
              <div className="space-y-4">
              {filteredContent.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:shadow-sm"
                  style={{ backgroundColor: 'var(--color-backgroundSecondary)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <Image
                      src={item.coverImage || '/images/placeholder.png'}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(item.status)}
                        <span className="text-xs font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                          {getStatusText(item.status)}
                        </span>
                        {item.series && (
                          <span className="px-2 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}>
                            {item.series.title} 
                            {item.chapterNumber && ` - Chapter ${item.chapterNumber}`}
                          </span>
                        )}
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
                        {item.status === 'REJECTED' && item.rejectionReason && (
                          <p className="text-sm text-red-500 mt-2">
                            Reason for rejection: {item.rejectionReason}
                          </p>
                        )}
                      <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                        <span>Created {formatDateTime(item.createdAt)}</span>
                        {item.publishedAt && (
                          <span>Published {formatDateTime(item.publishedAt)}</span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{item.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={item.type === 'PODCAST' ? `/creator/podcast/${item.id}` : `/creator/content/${item.id}`}
                      className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-500/10"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={item.type === 'PODCAST' ? `/creator/podcast/edit/${item.id}` : `/creator/edit/${item.id}`}
                      className="p-2 rounded-lg transition-colors text-blue-500 hover:bg-blue-500/10"
                      title="Edit"
                    >
                      <Edit size={16} />
                      </Link>
                      <Link
                        href={`/creator/analytics/${item.id}`}
                        className="p-2 rounded-lg transition-colors text-purple-500 hover:bg-purple-500/10"
                        title="Analytics"
                      >
                        <BarChart2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                      title="Archive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="card overflow-hidden"
                    style={{ backgroundColor: 'var(--color-card)' }}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.coverImage || '/images/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        layout="fill"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/60 text-white backdrop-blur-md capitalize">
                          {item.type.toLowerCase()}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-red-500/50 transition-colors"
                          title="Archive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                        <span>Created {formatDateTime(item.createdAt)}</span>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Eye size={12} />
                            <span>{item.views}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={item.type === 'PODCAST' ? `/creator/podcast/${item.id}` : `/creator/content/${item.id}`}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <Link
                          href={item.type === 'PODCAST' ? `/creator/podcast/edit/${item.id}` : `/creator/edit/${item.id}`}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </Link>
                        <Link
                          href={`/creator/analytics/${item.id}`}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                        >
                          <BarChart2 size={14} />
                          <span>Stats</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
  );
}