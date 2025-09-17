'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Heart, Eye, Clock, Tag } from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';

// Define TypeScript interfaces based on API response
interface ApiStory {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  coverImage: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
  likes: number;
  views: number;
  tags: string[];
  isFree: boolean;
  type: string;
  content: string;
  status: string;
  subscriptionTier: string | null;
  // Additional properties that might exist in API response
  [key: string]: unknown;
}

// Our app-specific Story interface
interface Story {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  likes: number;
  views: number;
  tags: string[];
  isFree: boolean;
}

interface ContentFilters {
  search?: string;
  tags?: string[];
  sortBy?: string;
}

// Type guard to check if an object is a valid Story
function isValidStory(data: unknown): data is Story {
  if (typeof data !== 'object' || data === null) return false;
  
  const story = data as Partial<Story>;
  return (
    typeof story.id === 'string' &&
    typeof story.title === 'string' &&
    typeof story.description === 'string' &&
    typeof story.author === 'string' &&
    typeof story.coverImage === 'string' &&
    typeof story.publishedAt === 'string' &&
    typeof story.readingTime === 'string' &&
    typeof story.likes === 'number' &&
    typeof story.views === 'number' &&
    Array.isArray(story.tags) &&
    story.tags.every(tag => typeof tag === 'string') &&
    typeof story.isFree === 'boolean'
  );
}

// Function to convert API story to our app Story format
function mapApiStoryToStory(apiStory: ApiStory): Story {
  return {
    id: apiStory.id,
    title: apiStory.title,
    description: apiStory.description,
    author: apiStory.author,
    coverImage: apiStory.coverImage,
    publishedAt: apiStory.publishedAt || apiStory.createdAt, // Fallback to createdAt if publishedAt is null
    readingTime: apiStory.readingTime,
    likes: apiStory.likes,
    views: apiStory.views,
    tags: apiStory.tags,
    isFree: apiStory.isFree
  };
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const { user, contentFilters, updateContentFilters } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contentData, allTags] = await Promise.all([
          contentApi.getAllContent({
            type: 'story',
            userTier: user?.subscription || 'free',
            ...contentFilters
          }),
          contentApi.getAllTags()
        ]);
        
        // Map API stories to our Story format and filter out invalid ones
        const validStories = contentData.content
          .map((item: unknown) => {
            // First try to map API story format
            const apiStory = item as ApiStory;
            if (apiStory.id && apiStory.type === 'story') {
              return mapApiStoryToStory(apiStory);
            }
            return null;
          })
          .filter((story): story is Story => story !== null && isValidStory(story));
        
        setStories(validStories);
        setTags(allTags);
      } catch (error) {
        console.error('Error loading stories:', error);
        setStories([]);
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
    // Ensure tags is always treated as string[]
    const currentTags: string[] = Array.isArray(contentFilters.tags) 
      ? contentFilters.tags 
      : [];
    
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag) // TypeScript can now infer 't' is string
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
            African Stories
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Immerse yourself in the rich tradition of African storytelling, 
            from ancient folktales to contemporary narratives.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search stories by title, description, or tags..."
              value={contentFilters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-inputBorder)',
                color: 'var(--color-textPrimary)',
                outlineColor: 'var(--color-primary)'
              }}
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tag Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium flex items-center" style={{ color: 'var(--color-textPrimary)' }}>
                <Tag size={16} className="mr-1" />
                Tags:
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
                value={contentFilters.sortBy || 'publishedAt'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: 'var(--color-inputBorder)',
                  color: 'var(--color-textPrimary)',
                  outlineColor: 'var(--color-primary)'
                }}
              >
                <option value="publishedAt">Latest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {loading ? 'Loading...' : `${stories.length} stories found`}
          </p>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg shadow-md overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-card)' }}>
                <div className="h-48" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                <div className="p-6">
                  <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="h-4 rounded w-2/3 mb-4" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/content/${story.id}`}
                className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 rounded-lg shadow-md"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={story.coverImage} 
                    alt={story.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}>
                      Story
                    </span>
                  </div>
                  
                  {!story.isFree && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 text-white text-xs font-semibold rounded-full" style={{ background: 'var(--gradient-primary)' }}>
                        Premium
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-4 text-white text-xs">
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{story.readingTime}</span>
                      </span>
                      <span>{formatDate(story.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 transition-colors line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {story.title}
                  </h3>
                  
                  <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                    {story.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      By {story.author}
                    </span>
                    
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{formatNumber(story.likes)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{formatNumber(story.views)}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded"
                        style={{ 
                          backgroundColor: 'var(--color-backgroundSecondary)', 
                          color: 'var(--color-textSecondary)' 
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded" style={{ 
                        backgroundColor: 'var(--color-backgroundSecondary)', 
                        color: 'var(--color-textSecondary)' 
                      }}>
                        +{story.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Search size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No stories found
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or filters to find more stories.
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