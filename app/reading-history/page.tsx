'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';

interface ReadingHistoryItem {
  id: string;
  title: string;
  type: string;
  author: string;
  coverImage: string;
  description: string;
  readingTime: string;
  lastReadAt: string;
  progress: number;
  completed: boolean;
}

export default function ReadingHistoryPage() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { user, isAuthenticated, readingProgress } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadReadingHistory = async () => {
      try {
        // Get all content and create mock reading history
        const contentData = await contentApi.getAllContent();
        
        // Mock reading history based on some content
        const mockHistory: ReadingHistoryItem[] = contentData.content.slice(0, 8).map((item: any, index: number) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          author: item.author,
          coverImage: item.coverImage,
          description: item.description,
          readingTime: item.readingTime,
          lastReadAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
          progress: readingProgress[item.id] || Math.floor(Math.random() * 100),
          completed: Math.random() > 0.5
        }));
        
        setHistory(mockHistory);
      } catch (error) {
        console.error('Error loading reading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReadingHistory();
  }, [isAuthenticated, readingProgress, router]);

  const filteredHistory = history.filter((item: ReadingHistoryItem) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
          Reading History
        </h1>
        <p style={{ color: 'var(--color-textSecondary)' }}>
          Continue where you left off or revisit your favorite reads
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
          <input
            type="text"
            placeholder="Search reading history..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-inputBorder)',
              color: 'var(--color-textPrimary)'
            }}
          >
            <option value="all">All Types</option>
            <option value="story">Stories</option>
            <option value="article">Articles</option>
            <option value="book">Books</option>
          </select>
        </div>
      </div>

      {/* Reading History */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--color-textTertiary)' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            {history.length === 0 ? 'No reading history yet' : 'No content found'}
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {history.length === 0 
              ? 'Start reading content to build your history.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          <Link
            href="/stories"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <BookOpen size={16} />
            <span>Explore Stories</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Link
              key={item.id}
              href={`/content/${item.id}`}
              className="card block p-6 transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="flex items-start space-x-6">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-24 h-18 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                      {item.type}
                    </span>
                    {item.completed && (
                      <span className="px-2 py-1 text-xs font-medium rounded text-green-600 bg-green-100">
                        Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {item.title}
                  </h3>

                  <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-textSecondary)' }}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span>By {item.author}</span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{item.readingTime}</span>
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      Last read {formatDate(item.lastReadAt)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          backgroundColor: 'var(--color-primary)', 
                          width: `${item.progress}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                      {item.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}