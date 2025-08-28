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
  Clock
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

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const contentData = await contentApi.getAllContent({
          author: user?.id,
          includeUnpublished: true
        });
        
        const draftContent = contentData.content.filter((c: ContentItem) => c.status === 'draft');
        setDrafts(draftContent);
      } catch (error) {
        console.error('Error loading drafts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, [user]);

  const filteredDrafts = drafts.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((item) => (
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
                  <span className="px-2 py-1 text-xs font-medium rounded-full text-yellow-600 bg-yellow-100">
                    Draft
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
                  <span className="capitalize">{item.type}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/creator/edit/${item.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    <Edit size={14} />
                    <span>Continue</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this draft?')) {
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
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}