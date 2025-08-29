'use client';

import { useEffect, useState } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Search,
  Filter
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface Comment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  comment: string;
  createdAt: string;
  likes: number;
  contentTitle?: string;
}

export default function CreatorCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useStore();

  useEffect(() => {
    const loadComments = async () => {
      try {
        // Get user's content first
        const contentData = await contentApi.getAllContent({
          author: user?.id,
          includeUnpublished: true
        });

        // Mock comments for user's content
        const mockComments: Comment[] = [
          {
            id: '1',
            contentId: '1',
            userId: '4',
            userName: 'Fatima Okafor',
            userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            comment: 'This is a beautiful retelling of the Golden Stool legend. I learned about this in school but this version captures the spiritual significance so well.',
            createdAt: '2024-01-21T14:30:00.000Z',
            likes: 12,
            contentTitle: 'The Golden Stool of Ashanti'
          },
          {
            id: '2',
            contentId: '5',
            userId: '4',
            userName: 'Fatima Okafor',
            userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            comment: 'Anansi stories always teach such profound lessons. Thank you for sharing this complete version - I only knew fragments before.',
            createdAt: '2024-02-09T11:45:00.000Z',
            likes: 15,
            contentTitle: 'Anansi the Spider: Wisdom Keeper'
          }
        ];

        setComments(mockComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [user]);

  const filteredComments = comments.filter((comment: Comment) =>
    comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.contentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
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
                {comment.userAvatar ? (
                  <Image
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                      {comment.userName}
                    </h3>
                    <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      commented on
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                      {comment.contentTitle}
                    </span>
                  </div>

                  <p className="mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                    {comment.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span>{formatDate(comment.createdAt)}</span>
                      <span className="flex items-center space-x-1">
                        <Heart size={12} />
                        <span>{comment.likes} likes</span>
                      </span>
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