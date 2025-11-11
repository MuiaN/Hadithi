'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Heart, Eye, Clock, FileText, Calendar, Grid, List, Tag } from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';
import { Badge } from '@/components/ui/badge';

// Define interfaces for our data structures
interface Article {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  likes: number;
  views: number;
  type: string;
  tags: string[];
  status: string;
  isFree: boolean;
  subscriptionTier?: string;
}

interface ContentFilters {
  type: string;
  tags: string[];
  author: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  userTier?: string;
  includeUnpublished?: boolean;
  limit?: number;
  page?: number;
}

interface User {
  subscription?: string;
  // Add other user properties as needed
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user, contentFilters, updateContentFilters } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contentData, allTags] = await Promise.all([
          contentApi.getAllContent({
            type: 'article',
            userTier: user?.subscription || 'free',
            ...contentFilters
          } as ContentFilters),
          contentApi.getAllTags()
        ]);
        
        setArticles(contentData.content as Article[]);
        setTags(allTags as string[]);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contentFilters, user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateContentFilters({ search: e.target.value });
  };

  const handleTagFilter = (tag: string) => {
    const currentTags = contentFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    
    updateContentFilters({ tags: newTags });
  };

  const handleSortChange = (sortBy: string) => {
    updateContentFilters({ sortBy });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            African Articles & Essays
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Dive deep into analytical pieces, historical accounts, and contemporary 
            perspectives on African culture, politics, and society.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search articles by title, topic, or author..."
              value={contentFilters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-inputBorder)',
                color: 'var(--color-textPrimary)'
              }}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tag Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium flex items-center" style={{ color: 'var(--color-textPrimary)' }}>
                <FileText size={16} className="mr-1" />
                Categories:
              </span>
              {tags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className="px-3 py-1 text-sm rounded-full transition-colors"
                  style={{
                    backgroundColor: contentFilters.tags?.includes(tag) 
                      ? 'var(--color-primary)' 
                      : 'var(--color-backgroundSecondary)',
                    color: contentFilters.tags?.includes(tag) 
                      ? 'white' 
                      : 'var(--color-textPrimary)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
              <span className="text-sm font-medium flex items-center" style={{ color: 'var(--color-textPrimary)' }}>
                <Filter size={16} className="mr-1" />
                Sort:
              </span>
              <select
                value={contentFilters.sortBy || 'publishedAt'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: 'var(--color-inputBorder)',
                  color: 'var(--color-textPrimary)'
                }}
              >
                <option value="publishedAt">Latest</option>
                <option value="views">Most Read</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {loading ? 'Loading...' : `${articles.length} articles found`}
          </p>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card rounded-lg shadow-md overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-card)' }}>
                <div className="h-48" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                <div className="p-6">
                  <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="h-4 rounded w-2/3 mb-4" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/content/${article.id}`}
                  className="card group overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={400}
                      height={192}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 transition-colors line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} className="mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} className="mr-1" />
                        <span>{article.readingTime}</span>
                      </span>
                    </div>
                    <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <span>By {article.author}</span>
                      </span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{formatNumber(article.likes)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{formatNumber(article.views)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="px-6 pb-4 flex flex-wrap gap-2">
                      {article.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/content/${article.id}`}
                  className="card group block p-6 transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="flex-shrink-0 sm:w-48">
                      <Image 
                        src={article.coverImage} 
                        alt={article.title}
                        width={192}
                        height={128}
                        className="w-full h-32 sm:h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded capitalize" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                          Article
                        </span>
                        <span className="flex items-center text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                          <Calendar size={12} className="mr-1" />
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                          <Clock size={12} className="mr-1" />
                          {article.readingTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold group-hover:text-amber-600 transition-colors mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                        {article.title}
                      </h3>
                      
                      <p className="mb-4 line-clamp-2 sm:line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                          By {article.author}
                        </span>
                        
                        <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          <span className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{formatNumber(article.likes)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{formatNumber(article.views)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <FileText size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No articles found
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or filters to find more articles.
            </p>
            <button
              onClick={() => updateContentFilters({ search: '', tags: [] })}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}