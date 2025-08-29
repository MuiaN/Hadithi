'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Users, BookOpen, Eye, Heart, MapPin } from 'lucide-react';
import { users } from '@/lib/mockData/users';
import { content } from '@/lib/mockData/content';
import Image from 'next/image';

interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
  totalContent: number;
  totalViews: number;
  totalLikes: number;
  location?: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        // Get content creators and editors from users
        const contentCreators = users.filter(user => 
          user.role === 'creator' || user.role === 'editor'
        );

        // Calculate stats for each author
        const authorsWithStats = contentCreators.map(user => {
          const userContent = content.filter(c => c.authorId === user.id);
          const totalViews = userContent.reduce((sum, c) => sum + c.views, 0);
          const totalLikes = userContent.reduce((sum, c) => sum + c.likes, 0);

          return {
            id: user.id,
            name: user.name,
            bio: user.bio || 'Passionate storyteller and cultural preservationist.',
            avatar: user.avatar || '',
            role: user.role,
            totalContent: userContent.length,
            totalViews,
            totalLikes,
            location: 'Africa' // Mock location
          };
        });

        setAuthors(authorsWithStats);
        setFilteredAuthors(authorsWithStats);
      } catch (error) {
        console.error('Error loading authors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  useEffect(() => {
    const filtered = authors.filter(author =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAuthors(filtered);
  }, [authors, searchTerm]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Meet Our Authors
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Discover the talented storytellers, historians, and cultural preservationists 
            who bring African narratives to life.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search authors by name or expertise..."
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {loading ? 'Loading...' : `${filteredAuthors.length} authors found`}
          </p>
        </div>

        {/* Authors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse" style={{ backgroundColor: 'var(--color-card)' }}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                    <div className="h-3 rounded w-2/3" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                  <div className="h-3 rounded w-3/4" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAuthors.length > 0 ? (
          <div className="content-grid">
            {filteredAuthors.map((author) => (
              <div
                key={author.id}
                className="card group p-6 transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="text-center mb-6">
                  {author.avatar ? (
                    <Image 
                      src={author.avatar} 
                      alt={author.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-white font-bold text-xl">
                        {author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {author.name}
                  </h3>
                  
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)20', color: 'var(--color-primary)' }}>
                    {author.role}
                  </span>
                </div>

                <p className="text-sm mb-6 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                  {author.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                      {author.totalContent}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                      Stories
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye size={16} style={{ color: 'var(--color-info)' }} />
                    </div>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                      {formatNumber(author.totalViews)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                      Views
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Heart size={16} style={{ color: 'var(--color-error)' }} />
                    </div>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                      {formatNumber(author.totalLikes)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                      Likes
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {author.location && (
                    <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <MapPin size={14} />
                      <span>{author.location}</span>
                    </div>
                  )}
                  
                  <Link
                    href={`/authors/${author.id}`}
                    className="text-sm font-medium transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Users size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No authors found
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search to find more authors.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}