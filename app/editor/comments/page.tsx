'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Eye, 
  Check, 
  X, 
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
  status: 'pending' | 'approved' | 'rejected';
  contentTitle?: string;
}

export default function EditorCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const { user } = useStore();

  useEffect(() => {
    const loadComments = async () => {
      try {
        // Get all content to map comment content titles
        const contentData = await contentApi.getAllContent({ includeUnpublished: true });
        const contentMap = new Map(contentData.content.map((c: any) => [c.id, c.title]));

        // Mock comments for moderation
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
            id: '3',
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
        setFilteredComments(mockComments.filter(c => c.status === 'pending'));
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

    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.contentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
          Comment Moderation
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Review and moderate user comments
        </p>
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
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No comments to review
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              All comments have been moderated.
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                        {comment.status}
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}