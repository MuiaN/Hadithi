'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Search
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

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

export default function PendingContentPage() {
  const [pendingContent, setPendingContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'editor') {
      router.push('/auth/login');
      return;
    }

    const loadPendingContent = async () => {
      try {
        const contentData = await contentApi.getAllContent({ 
          includeUnpublished: true
        });
        
        const pending = contentData.content.filter((c: ContentItem) => c.status === 'in-review');
        setPendingContent(pending);
      } catch (error) {
        console.error('Error loading pending content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPendingContent();
  }, [isAuthenticated, user, router]);

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    try {
      await contentApi.updateContentStatus(contentId, newStatus);
      setPendingContent(prev => prev.filter((item: ContentItem) => item.id !== contentId));
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredContent = pendingContent.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Pending Review
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Content waiting for editorial review and approval
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search pending content..."
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
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <div 
            key={item.id}
            className="p-6 rounded-lg shadow-sm"
            style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <Image 
                  src={item.coverImage} 
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  width={80}
                  height={80}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      Pending Review
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-textSecondary)' }}>
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                    <span>By {item.author}</span>
                    <span>Submitted {formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
              
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
                  onClick={() => handleStatusChange(item.id, 'published')}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-success)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-success)10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Approve"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => handleStatusChange(item.id, 'rejected')}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-error)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-error)10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Reject"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No pending content
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              All content has been reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}