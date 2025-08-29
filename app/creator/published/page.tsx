'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  Eye, 
  Heart, 
  MessageCircle, 
  Search,
  Calendar,
  Plus,
  TrendingUp
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

export default function PublishedPage() {
  const [published, setPublished] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadPublished = async () => {
      try {
        const contentData = await contentApi.getAllContent({
          author: user?.id,
          includeUnpublished: true
        });
        
        const publishedContent = contentData.content.filter((c: ContentItem) => c.status === 'published');
        setPublished(publishedContent);
      } catch (error) {
        console.error('Error loading published content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublished();
  }, [user]);

  const filteredPublished = published.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
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
              Published Content
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Your content that&apos;s live and available to readers
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {published.length}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
              Published
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search published content..."
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

      {/* Published Content */}
      {filteredPublished.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            {published.length === 0 ? 'No published content yet' : 'No content found'}
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {published.length === 0 
              ? 'Create and submit content for review to get published.'
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
        <div className="space-y-6">
          {filteredPublished.map((item) => (
            <div
              key={item.id}
              className="card p-6"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="flex items-start space-x-6">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                  width={128}
                  height={96}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-xs font-medium px-2 py-1 rounded-full text-green-600 bg-green-100">
                      Published
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {item.title}
                  </h3>

                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-textSecondary)' }}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>Published {formatDate(item.publishedAt)}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{formatNumber(item.views)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{formatNumber(item.likes)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle size={14} />
                        <span>0</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/content/${item.id}`}
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
                  </Link>
                  <Link
                    href={`/creator/analytics/${item.id}`}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)10';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Analytics"
                  >
                    <TrendingUp size={16} />
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