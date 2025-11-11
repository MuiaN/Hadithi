'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Heart, Eye, Clock, Play, Pause, Headphones, Grid, List, Tag } from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface PodcastItem {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  duration: string;
  audioUrl: string;
  publishedAt: string;
  views: number;
  likes: number;
  tags: string[];
  isFree?: boolean;
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user, contentFilters, updateContentFilters } = useStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock podcast data
        const mockPodcasts: PodcastItem[] = [
          {
            id: 'p1',
            title: 'Voices of the Ancestors',
            author: 'Kwame Asante',
            description: 'Exploring ancient African wisdom through oral traditions and storytelling. Journey through time as we uncover the profound teachings of our ancestors.',
            coverImage: '/images/An Old Kikuyu Guard.jpg',
            duration: '45:32',
            audioUrl: '#',
            publishedAt: '2024-02-15T10:00:00.000Z',
            views: 1240,
            likes: 89,
            tags: ['oral-tradition', 'wisdom', 'ancestors', 'culture'],
            isFree: true
          },
          {
            id: 'p2',
            title: 'Ubuntu Philosophy Today',
            author: 'Amara Kone',
            description: 'How ancient African philosophy applies to modern community building and social harmony in today\'s interconnected world.',
            coverImage: '/images/Kikuyu People.jpg',
            duration: '38:15',
            audioUrl: '#',
            publishedAt: '2024-02-12T14:00:00.000Z',
            views: 892,
            likes: 67,
            tags: ['ubuntu', 'philosophy', 'community', 'modern'],
            isFree: false
          },
          {
            id: 'p3',
            title: 'The Griot Tradition',
            author: 'Fatima Okafor',
            description: 'Understanding the role of griots as keepers of African history and culture, and their importance in preserving our heritage.',
            coverImage: '/images/The Karachuonyo Dancers.jpg',
            duration: '52:18',
            audioUrl: '#',
            publishedAt: '2024-02-10T16:00:00.000Z',
            views: 1456,
            likes: 112,
            tags: ['griot', 'history', 'music', 'storytelling'],
            isFree: false
          },
          {
            id: 'p4',
            title: 'African Kingdoms: Mali Empire',
            author: 'Kwame Asante',
            description: 'Dive deep into the golden age of the Mali Empire, exploring its wealth, culture, and lasting impact on African civilization.',
            coverImage: '/images/Marakwet warriors.jpg',
            duration: '41:27',
            audioUrl: '#',
            publishedAt: '2024-02-08T11:00:00.000Z',
            views: 734,
            likes: 54,
            tags: ['mali', 'empire', 'history', 'kingdoms'],
            isFree: true
          },
          {
            id: 'p5',
            title: 'Modern African Literature',
            author: 'Amara Kone',
            description: 'Exploring contemporary African authors and their contributions to world literature, from Chinua Achebe to Chimamanda Ngozi Adichie.',
            coverImage: '/images/1991 Africa, Hwange_04_002.JPG',
            duration: '36:44',
            audioUrl: '#',
            publishedAt: '2024-02-05T09:00:00.000Z',
            views: 623,
            likes: 43,
            tags: ['literature', 'modern', 'authors', 'books'],
            isFree: false
          },
          {
            id: 'p6',
            title: 'African Music Evolution',
            author: 'Fatima Okafor',
            description: 'From traditional drums to Afrobeats: tracing the evolution of African music and its global influence.',
            coverImage: '/images/Luo dancers from Nyanza.jpg',
            duration: '49:12',
            audioUrl: '#',
            publishedAt: '2024-02-03T15:00:00.000Z',
            views: 987,
            likes: 78,
            tags: ['music', 'afrobeats', 'culture', 'evolution'],
            isFree: true
          }
        ];
        
        setPodcasts(mockPodcasts);
        
        // Extract unique tags
        const allTags = mockPodcasts.reduce((tags: string[], podcast) => {
          podcast.tags.forEach(tag => {
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          });
          return tags;
        }, []);
        
        setTags(allTags);
      } catch (error) {
        console.error('Error loading podcasts:', error);
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

  const togglePodcastPlay = (podcastId: string) => {
    setPlayingPodcast(playingPodcast === podcastId ? null : podcastId);
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

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = contentFilters.search === '' || 
      podcast.title.toLowerCase().includes(contentFilters.search.toLowerCase()) ||
      podcast.author.toLowerCase().includes(contentFilters.search.toLowerCase()) ||
      podcast.description.toLowerCase().includes(contentFilters.search.toLowerCase());
    
    const matchesTags = !contentFilters.tags?.length || 
      contentFilters.tags.some((tag: string) => podcast.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            African Audio Podcasts
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Listen to captivating African stories, wisdom, and cultural insights through our immersive audio experiences.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search podcasts by title, author, or topic..."
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
                <Headphones size={16} className="mr-1" />
                Topics:
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
                <option value="views">Most Listened</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {loading ? 'Loading...' : `${filteredPodcasts.length} podcasts found`}
          </p>
        </div>

        {/* Podcasts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        ) : filteredPodcasts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast) => (
                <Link
                  key={podcast.id}
                  href={`/content/${podcast.id}`}
                  className="card group overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={podcast.coverImage}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={400}
                      height={192}
                    />
                    <div 
                      className="absolute top-4 right-4 px-2 py-1 rounded-full text-white text-xs font-medium shadow-md"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <Clock className="inline-block w-3 h-3 mr-1" />{podcast.duration}
                    </div>
                    {!podcast.isFree && (
                      <div className="absolute top-4 left-4">
                        <Badge className="shadow-sm font-medium text-white" style={{ background: 'var(--gradient-primary)' }}>
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 transition-colors line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                      {podcast.title}
                    </h3>
                    <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                      {podcast.description}
                    </p>
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <span>By {podcast.author}</span>
                      </span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{formatNumber(podcast.likes)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{formatNumber(podcast.views)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {podcast.tags.length > 0 && (
                    <div className="px-6 pb-4 flex flex-wrap gap-2">
                      {podcast.tags.slice(0, 4).map((tag, index) => (
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
              {filteredPodcasts.map((podcast) => (
                <Link
                  key={podcast.id}
                  href={`/content/${podcast.id}`}
                  className="card group block p-6 transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="flex-shrink-0 sm:w-48 relative">
                      <Image 
                        src={podcast.coverImage} 
                        alt={podcast.title}
                        width={192}
                        height={192}
                        className="w-full h-48 sm:h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div 
                        className="absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-medium shadow-md"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <Clock className="inline-block w-3 h-3 mr-1" />{podcast.duration}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {!podcast.isFree && (
                          <Badge className="shadow-sm font-medium text-white" style={{ background: 'var(--gradient-primary)' }}>
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold group-hover:text-amber-600 transition-colors mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                        {podcast.title}
                      </h3>
                      
                      <p className="mb-4 line-clamp-2 sm:line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                        {podcast.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                          By {podcast.author}
                        </span>
                        
                        <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          <span className="flex items-center space-x-1">
                            <Heart size={14} />
                            <span>{formatNumber(podcast.likes)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye size={14} />
                            <span>{formatNumber(podcast.views)}</span>
                          </span>
                        </div>
                      </div>

                      {podcast.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {podcast.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Headphones size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No podcasts found
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or filters to find more podcasts.
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