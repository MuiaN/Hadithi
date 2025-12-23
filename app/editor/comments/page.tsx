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
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

interface Comment {
  id: string;
  contentId: string;
  comment: string;
  createdAt: string;
  // New fields from Prisma
  author: {
    name: string;
    avatar: string | null;
  };
  content: {
    title: string;
  };
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
        const res = await fetch('/api/v1/editor/comments');
        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }
        const allComments: Comment[] = await res.json();

        // For now, we don't have a status on comments in Prisma, so we show all.
        // We can add a 'status' field to the Comment model later.
        setComments(allComments);
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
        comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.content.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter is disabled for now as the model doesn't support it yet.
    // if (statusFilter !== 'all') {
    //   filtered = filtered.filter(comment => comment.status === statusFilter);
    // }
    
    setFilteredComments(filtered);
  }, [comments, searchTerm, statusFilter]);

  const handleStatusChange = (commentId: string, newStatus: 'approved' | 'rejected') => {
    // This would be an API call to PUT /api/v1/editor/comments/[id]/status
    // For now, we just remove it from the list to simulate moderation.
    setComments(prev => prev.filter(comment => comment.id !== commentId));
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
            <option value="all">All Comments</option>
            {/* Re-enable when status is added to Comment model */}
            {/* <option value="pending">Pending</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option> */}
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
                  {comment.author.avatar ? (
                    <Image
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
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
                        on
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                        {comment.content.title}
                      </span>
                      {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                        {comment.status} 
                      </span> */}
                    </div>

                    <p className="mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                      {comment.comment}
                    </p>

                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span>{formatDate(comment.createdAt)}</span>
                      <span className="flex items-center space-x-1">
                      </span>
                    </div>
                  </div>
                </div>

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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}