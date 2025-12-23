'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  author: { name: string };
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  createdAt: string;
  views: number;
  _count: { likes: number };
  coverImage: string;
  description: string;
}
export default function EditorDashboard() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0, // DRAFT status
    archived: 0 // ARCHIVED status
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadEditorData = async () => {
      try {
        // Fetch all content from the new editor-specific endpoint
        const res = await fetch('/api/v1/editor/content');
        if (!res.ok) {
          throw new Error('Failed to fetch content');
        }
        const contentData = await res.json();

        // Calculate stats on the client-side
        const total = contentData.length;
        const published = contentData.filter((c: ContentItem) => c.status === 'PUBLISHED').length;
        const draft = contentData.filter((c: ContentItem) => c.status === 'DRAFT').length;
        const archived = contentData.filter((c: ContentItem) => c.status === 'ARCHIVED').length;

        setStats({
          total,
          published,
          draft,
          archived,
        });
        setContent(contentData);
        setFilteredContent(contentData);
      } catch (error) {
        console.error('Error loading editor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEditorData();
  }, []);

  useEffect(() => {
    let filtered = content;
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter((item: ContentItem) => item.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item: ContentItem) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredContent(filtered);
  }, [content, filter, searchTerm]);

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/editor/content/${contentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const updatedItem = await res.json();

      // Update local state to reflect the change immediately
      setContent(prev => prev.map(item => (item.id === contentId ? { ...item, status: updatedItem.status } : item)));

    } catch (error) {
      console.error('Error updating content status:', error);
      // Optionally show a toast notification to the user
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'DRAFT':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'ARCHIVED':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'text-green-600 bg-green-100';
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-100';
      case 'ARCHIVED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
                Editorial Dashboard
              </h1>
              <p style={{ color: 'var(--color-textSecondary)' }}>
                Manage content workflow and review submissions
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Total
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {stats.total}
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
                  {stats.published}
                </p>
              </div>
              <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Draft
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {stats.draft}
                </p>
              </div>
              <AlertCircle size={24} style={{ color: 'var(--color-warning)' }} />
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                  Archived
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                  {stats.archived}
                </p>
              </div>
              <XCircle size={24} style={{ color: 'var(--color-error)' }} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
            <input
              type="text"
              placeholder="Search content..."
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--color-input)', 
                borderColor: 'var(--color-inputBorder)',
                color: 'var(--color-textPrimary)'
              }}
            >
              <option value="all">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-textSecondary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ outlineColor: 'var(--color-border)' }}>
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={item.coverImage || '/images/placeholder.png'}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          width={48}
                          height={48}
                        />
                        <div>
                          <h3 className="font-medium line-clamp-1" style={{ color: 'var(--color-textPrimary)' }}>
                            {item.title}
                          </h3>
                          <p className="text-sm capitalize" style={{ color: 'var(--color-textSecondary)' }}>
                            {item.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                        {item.author.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(item.status)}`}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Eye size={14} style={{ color: 'var(--color-textTertiary)' }} />
                        <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                          {item.views.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/content/${item.id}`)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--color-textSecondary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/editor/edit/${item.id}`)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--color-primary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)10';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                No content found
              </h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No content has been submitted yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
  );
}