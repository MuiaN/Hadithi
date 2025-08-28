'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Heart, Eye, Clock, FileText, Calendar } from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const { user, contentFilters, updateContentFilters } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contentData, allTags] = await Promise.all([
          contentApi.getAllContent({
            type: 'article',
            userTier: user?.subscription || 'free',
            ...contentFilters
          }),
          contentApi.getAllTags()
        ]);
        
        setArticles(contentData.content);
        setTags(allTags);
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
      ? currentTags.filter(t => t !== tag)
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
              value={contentFilters.search}
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
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium flex items-center" style={{ color: 'var(--color-textPrimary)' }}>
                <Filter size={16} className="mr-1" />
                Sort:
              </span>
              <select
                value={contentFilters.sortBy}
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
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse" style={{ backgroundColor: 'var(--color-card)' }}>
                <div className="flex space-x-4">
                  <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article: any) => (
              <Link
                key={article.id}
                href={`/content/${article.id}`}
                className="card group block p-6 transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="flex space-x-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-32 h-24 rounded-lg object-cover"
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
                    
                    <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
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