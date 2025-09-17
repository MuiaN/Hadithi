'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, Eye, ArrowRight, Search, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readingTime: string;
  views: number;
  category: string;
  coverImage: string;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'platform-updates', 'community', 'culture', 'technology'];

  useEffect(() => {
    // Mock blog posts
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Introducing New Audio Features for African Storytelling',
        excerpt: 'We\'re excited to announce new audio capabilities that bring African stories to life through immersive sound experiences.',
        content: 'Full blog post content here...',
        author: 'Hadithi Team',
        authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        publishedAt: '2024-02-15T10:00:00.000Z',
        readingTime: '5 min read',
        views: 1240,
        category: 'platform-updates',
        coverImage: 'https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['audio', 'features', 'storytelling']
      },
      {
        id: '2',
        title: 'Celebrating African Heritage Month: Community Highlights',
        excerpt: 'Join us in celebrating the incredible contributions from our community during African Heritage Month.',
        content: 'Full blog post content here...',
        author: 'Amara Kone',
        authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        publishedAt: '2024-02-12T14:00:00.000Z',
        readingTime: '7 min read',
        views: 892,
        category: 'community',
        coverImage: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['heritage', 'community', 'celebration']
      },
      {
        id: '3',
        title: 'The Digital Preservation of Oral Traditions',
        excerpt: 'Exploring how technology can help preserve and share African oral traditions for future generations.',
        content: 'Full blog post content here...',
        author: 'Kwame Asante',
        authorAvatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        publishedAt: '2024-02-10T09:00:00.000Z',
        readingTime: '8 min read',
        views: 1456,
        category: 'culture',
        coverImage: 'https://images.pexels.com/photos/8828431/pexels-photo-8828431.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['oral-traditions', 'technology', 'preservation']
      },
      {
        id: '4',
        title: 'Building Inclusive Communities Through Storytelling',
        excerpt: 'How African storytelling traditions can help build more inclusive and connected communities worldwide.',
        content: 'Full blog post content here...',
        author: 'Fatima Okafor',
        authorAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        publishedAt: '2024-02-08T16:00:00.000Z',
        readingTime: '6 min read',
        views: 734,
        category: 'community',
        coverImage: 'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['community', 'inclusion', 'storytelling']
      },
      {
        id: '5',
        title: 'Platform Updates: Enhanced Search and Discovery',
        excerpt: 'We\'ve improved our search functionality to help you discover African stories more easily.',
        content: 'Full blog post content here...',
        author: 'Hadithi Team',
        authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        publishedAt: '2024-02-05T11:00:00.000Z',
        readingTime: '4 min read',
        views: 567,
        category: 'platform-updates',
        coverImage: 'https://images.pexels.com/photos/4577735/pexels-photo-4577735.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['platform', 'search', 'updates']
      }
    ];

    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, categoryFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Hadithi Blog
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Stay updated with platform news, community highlights, and insights into African culture and heritage.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-inputBorder)',
                color: 'var(--color-textPrimary)'
              }}
            />
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium flex items-center" style={{ color: 'var(--color-textPrimary)' }}>
                <Filter size={16} className="mr-1" />
                Categories:
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className="px-3 py-1 text-sm rounded-full transition-colors capitalize"
                  style={{
                    backgroundColor: categoryFilter === category 
                      ? 'var(--color-primary)' 
                      : 'var(--color-backgroundSecondary)',
                    color: categoryFilter === category 
                      ? 'white' 
                      : 'var(--color-textPrimary)'
                  }}
                >
                  {category.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <div className="card overflow-hidden" style={{ backgroundColor: 'var(--color-card)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={filteredPosts[0].coverImage}
                    alt={filteredPosts[0].title}
                    className="w-full h-full object-cover"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                      Featured
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full capitalize" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textSecondary)' }}>
                      {filteredPosts[0].category.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                    {filteredPosts[0].title}
                  </h2>
                  
                  <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
                    {filteredPosts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={filteredPosts[0].authorAvatar}
                          alt={filteredPosts[0].author}
                          className="w-6 h-6 rounded-full object-cover"
                          width={24}
                          height={24}
                        />
                        <span>{filteredPosts[0].author}</span>
                      </div>
                      <span>{formatDate(filteredPosts[0].publishedAt)}</span>
                      <span>{filteredPosts[0].readingTime}</span>
                    </div>
                    
                    <Link
                      href={`/blog/${filteredPosts[0].id}`}
                      className="flex items-center space-x-2 text-sm font-medium transition-colors"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="content-grid">
          {filteredPosts.slice(1).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="card group overflow-hidden transition-all duration-300"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width={400}
                  height={192}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-white text-xs font-semibold rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {post.category.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {post.title}
                </h3>
                
                <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-5 h-5 rounded-full object-cover"
                      width={20}
                      height={20}
                    />
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>{formatNumber(post.views)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Search size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No blog posts found
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}