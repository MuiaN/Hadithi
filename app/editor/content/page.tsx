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
  Search,
  Filter
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

export default function EditorContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'editor') {
      router.push('/auth/login');
      return;
    }

    const loadContent = async () => {
      try {
        const contentData = await contentApi.getAllContent({ 
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
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    let filtered = content;
    
    if (filter !== 'all') {
      filtered = filtered.filter((item: ContentItem) => item.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter((item: ContentItem) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredContent(filtered);
  }, [content, filter, searchTerm]);

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    try {
      await contentApi.updateContentStatus(contentId, newStatus);
      setContent(prev => prev.map((item: ContentItem) => 
        item.id === contentId ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'draft':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'in-review':
        return <Clock size={16} className="text-blue-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
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
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
          All Content
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Review and manage all platform content
        </p>
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
            <option value="published">Published</option>
            <option value="in-review">In Review</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
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
            <tbody className="divide-y" style={{ divideColor: 'var(--color-border)' }}>
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.coverImage} 
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
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
                      {item.author}
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
                        <option value="draft">Draft</option>
                        <option value="in-review">In Review</option>
                        <option value="published">Published</option>
                        <option value="rejected">Rejected</option>
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