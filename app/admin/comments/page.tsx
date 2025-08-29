'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Eye, 
  Check, 
  X, 
  Flag, 
  Search, 
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
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
  status?: 'pending' | 'approved' | 'rejected';
  contentTitle?: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        // Get all content to map comment content titles
        const contentData = await contentApi.getAllContent({ includeUnpublished: true });
        const contentMap = new Map(contentData.content.map((c: any) => [c.id, c.title]));

        // Mock comments with status for moderation
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
            status: 'approved',
            contentTitle: contentMap.get('1')
          },
          {
            id: '2',
            contentId: '1',
            userId: '3',
            userName: 'Amara Kone',
            userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            comment: 'The way you describe Okomfo Anokye gives me chills! Our ancestors had such powerful wisdom.',
            createdAt: '2024-01-22T09:15:00.000Z',
            likes: 8,
            status: 'approved',
            contentTitle: contentMap.get('1')
          },
          {
            id: '3',
            contentId: '5',
            userId: '4',
            userName: 'Fatima Okafor',
            userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            comment: 'Anansi stories always teach such profound lessons. Thank you for sharing this complete version - I only knew fragments before.',
            createdAt: '2024-02-09T11:45:00.000Z',
            likes: 15,
            status: 'approved',
            contentTitle: contentMap.get('5')
          },
          {
            id: '4',
            contentId: '2',
            userId: '5',
            userName: 'John Doe',
            userAvatar: '',
            comment: 'This content seems inappropriate and doesn\'t belong here.',
            createdAt: '2024-02-15T16:20:00.000Z',
            likes: 0,
            status: 'pending',
            contentTitle: contentMap.get('2')
          },
          {
            id: '5',
            contentId: '3',
            userId: '6',
            userName: 'Jane Smith',
            userAvatar: '',
            comment: 'Great article! Really helped me understand Ubuntu philosophy better.',
            createdAt: '2024-02-14T10:30:00.000Z',
            likes: 3,
            status: 'pending',
            contentTitle: contentMap.get('3')
          }
        ];

        setComments(mockComments);
        setFilteredComments(mockComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  useEffect(() => {
    let filtered = comments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.contentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(comment => comment.status === statusFilter);
    }

    setFilteredComments(filtered);
  }, [comments, searchTerm, statusFilter]);

  const handleStatusChange = (commentId: string, newStatus: 'approved' | 'rejected') => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, status: newStatus } : comment
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              Comment Moderation
            </h1>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Review and moderate user comments
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Total Comments
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {comments.length}
              </p>
            </div>
            <MessageCircle size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Pending Review
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {comments.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Flag size={24} style={{ color: 'var(--color-warning)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Approved
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {comments.filter(c => c.status === 'approved').length}
              </p>
            </div>
            <Check size={24} style={{ color: 'var(--color-success)' }} />
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-textSecondary)' }}>
                Rejected
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                {comments.filter(c => c.status === 'rejected').length}
              </p>
            </div>
            <X size={24} style={{ color: 'var(--color-error)' }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className="p-6 rounded-lg shadow-sm"
            style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {comment.userAvatar ? (
                  <Image
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
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
                      on
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                      {comment.contentTitle}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status || 'pending')}`}>
                      {comment.status || 'pending'}
                    </span>
                  </div>

                  <p className="mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                    {comment.comment}
                  </p>

                  <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    <span>{formatDate(comment.createdAt)}</span>
                    <span className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{comment.likes} likes</span>
                    </span>
                  </div>
                </div>
              </div>

              {comment.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusChange(comment.id, 'approved')}
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
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(comment.id, 'rejected')}
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
                    <X size={16} />
                  </button>
                </div>
              )}

              {comment.status !== 'pending' && (
                <button
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-textSecondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No comments found
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No comments have been posted yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}