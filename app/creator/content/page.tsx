'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Plus
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

export default function CreatorContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentData = await contentApi.getAllContent({
          author: user?.id,
          includeUnpublished: true
        });
        
        setContent(contentData.content);
        setFilteredContent(contentData.content);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user]);

  useEffect(() => {
    let filtered = content;

    if (searchTerm) {
      filtered = filtered.filter((item: ContentItem) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item: ContentItem) => item.status === statusFilter);
    }

    setFilteredContent(filtered);
  }, [content, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-review':
        return 'text-blue-600 bg-blue-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
              My Content
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Manage all your created content
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

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search your content..."
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

        <div className="flex items-center space-x-2">
          <Filter size={16} style={{ color: 'var(--color-textSecondary)' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-inputBorder)',
              color: 'var(--color-textPrimary)'
            }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="in-review">In Review</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            {content.length === 0 ? 'No content yet' : 'No content found'}
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {content.length === 0 
              ? 'Start creating your first piece of content to share with the community.'
              : 'Try adjusting your search or filter criteria.'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="card overflow-hidden"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="relative h-48">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
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

                <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                  <span>Created {formatDate(item.createdAt)}</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>{item.views}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/content/${item.id}`}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}