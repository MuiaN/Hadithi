'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  XCircle, 
  Eye, 
  Edit, 
  Search,
  AlertTriangle
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
  coverImage: string;
  description: string;
  rejectionReason?: string | null;
}

export default function EditorRejectedPage() {
  const [rejected, setRejected] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadRejected = async () => {
      try {
        const res = await fetch('/api/v1/editor/content?status=ARCHIVED');
        if (!res.ok) throw new Error('Failed to fetch rejected content');
        const rejectedContent = await res.json();
        setRejected(rejectedContent);
      } catch (error) {
        console.error('Error loading rejected content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRejected();
  }, []);

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/editor/content/${contentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setRejected(prev => prev.filter((item: ContentItem) => item.id !== contentId));
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

  const filteredRejected = rejected.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Rejected Content
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Content that has been rejected and needs revision
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search rejected content..."
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
        {filteredRejected.length === 0 ? (
          <div className="text-center py-12">
            <XCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No rejected content
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              All content has been properly reviewed.
            </p>
          </div>
        ) : (
          filteredRejected.map((item) => (
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
                      <XCircle size={16} className="text-red-500" />
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600 capitalize">
                        {item.status.toLowerCase()}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                        {item.type.toLowerCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-textSecondary)' }}>
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textTertiary)' }}>
                      <span>By {item.author.name}</span>
                      <span>Archived {formatDate(item.createdAt)}</span>
                    </div>
                    
                    {item.rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-error)10', border: '1px solid var(--color-error)20' }}>
                        <div className="flex items-start space-x-2">
                          <AlertTriangle size={14} style={{ color: 'var(--color-error)' }} className="mt-0.5" />
                          <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>
                              Rejection Reason:
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                              {item.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                    onClick={() => handleStatusChange(item.id, 'DRAFT')}
                    className="px-3 py-1 text-xs rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--color-info)', color: 'white' }}
                    title="Send back for review"
                  >
                    Re-review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}