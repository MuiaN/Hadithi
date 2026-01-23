'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Edit, 
  Trash2, 
  Search,
  Plus,
  Clock,
  LayoutGrid,
  List,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart2
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED';
  publishedAt: string | null;
  createdAt: string;
  views: number;
  _count?: { likes: number };
  coverImage: string | null;
  description: string;
  rejectionReason: string | null; // Added rejectionReason
  series?: {
    id: string;
    title: string;
  } | null;
  chapterNumber?: number;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const res = await fetch('/api/v1/creator/content?status=DRAFT&status=REJECTED'); // Fetch DRAFT and REJECTED
        if (!res.ok) throw new Error('Failed to fetch drafts');
        const data = await res.json();
        setDrafts(data);
      } catch (error) {
        console.error('Error loading drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const filteredDrafts = drafts.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'text-green-600 bg-green-100';
      case 'DRAFT': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING_APPROVAL': return 'text-blue-600 bg-blue-100';
      case 'ARCHIVED': return 'text-red-600 bg-red-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return <CheckCircle size={16} className="text-green-500" />;
      case 'PENDING_APPROVAL': return <Clock size={16} className="text-blue-500" />;
      case 'DRAFT': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'ARCHIVED': return <XCircle size={16} className="text-gray-500" />;
      case 'REJECTED': return <XCircle size={16} className="text-red-500" />;
      default: return <XCircle size={16} className="text-red-500" />;
    }
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
              Drafts
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Continue working on your unpublished content
            </p>
          </div>
          <Link
            href="/creator/new"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <Plus size={16} />
            <span>New Content</span>
          </Link>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search drafts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-inputBorder)',
              color: 'var(--color-textPrimary)'
            }}
          />
        </div>

        {/* View Toggle */}
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

      {/* Drafts Grid */}
      {filteredDrafts.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            {drafts.length === 0 ? 'No drafts yet' : 'No drafts found'}
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {drafts.length === 0 
              ? 'Start creating content to see your drafts here.'
              : 'Try adjusting your search criteria.'
            }
          </p>
          <Link
            href="/creator/new"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <Plus size={16} />
            <span>Create Content</span>
          </Link>
        </div>
      ) : (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((item) => (
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
                    {item.status.toLowerCase()}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/60 text-white backdrop-blur-md capitalize">
                    {item.type.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {item.title}
                </h3>
                <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                  {item.description}
                  </p>
                  {item.status === 'REJECTED' && item.rejectionReason && (
                    <p className="text-sm text-red-500 mt-2">
                      Reason for rejection: {item.rejectionReason}
                    </p>
                  )}                

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
                    href={`/creator/edit/${item.id}`}
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
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this draft?')) {
                        // Handle delete
                      }
                    }}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="space-y-4">
            {filteredDrafts.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:shadow-sm"
                style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
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
                        {item.status.toLowerCase()}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                        {item.type.toLowerCase()}
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
                    href={`/creator/edit/${item.id}`}
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
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this draft?')) {
                        // Handle delete
                      }
                    }}
                    className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                    title="Archive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}