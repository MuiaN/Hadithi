'use client';

import { useEffect, useState } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Search,
  Filter
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface Comment {
  id: string;
  contentId: string;
  comment: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string | null;
  };
  content: { 
    title: string;
    series?: { id: string; title: string } | null;
    rejectionReason?: string | null; // Added rejectionReason
    chapterNumber?: number | null;
  };
}

export default function CreatorCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useStore();

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await fetch('/api/v1/creator/comments');
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  const filteredComments = comments.filter((comment: Comment) =>
    comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          Comments
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Engage with readers who commented on your content
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search comments..."
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

      {/* Comments List */}
      <div className="space-y-6">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No comments yet
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Comments on your published content will appear here.
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-start space-x-4">
                {comment.author.avatar ? (
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                      {comment.author.name}
                    </h3>
                    <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      commented on
                    </span>
                    {comment.content.series && (
                      <span className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                        {comment.content.series.title}
                        {comment.content.chapterNumber && ` - Chapter ${comment.content.chapterNumber}`}
                      </span>
                    )}
                    <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                      {comment.content.title}
                    </span>
                  </div>

                  <p className="mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                    {comment.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>

                    <button
                      className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors"
                      style={{ color: 'var(--color-primary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary)10';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Reply size={14} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}