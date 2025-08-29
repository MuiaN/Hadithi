'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Users, Zap, Star, Heart, Eye, Clock, Play, Pause, Volume2, Headphones, Mic, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  views: number;
  likes: number;
  coverImage: string;
  description: string;
  readingTime: string;
  isFree?: boolean;
  duration?: string;
  audioUrl?: string;
}

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
}

export default function Home() {
  const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([]);
  const [latestContent, setLatestContent] = useState<ContentItem[]>([]);
  const [featuredPodcasts, setFeaturedPodcasts] = useState<PodcastItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);
  const [latestSlide, setLatestSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Use the store hook only after component mounts
  const storeUser = useStore(state => state.user);

  useEffect(() => {
    setIsMounted(true);
    setUser(storeUser);
    
    const loadContent = async () => {
      try {
        const [featured, latest] = await Promise.all([
          contentApi.getFeaturedContent(6),
          contentApi.getLatestContent(5)
        ]);
        
        setFeaturedContent(featured);
        setLatestContent(latest);

        // Mock podcast data
        const mockPodcasts: PodcastItem[] = [
          {
            id: 'p1',
            title: 'Voices of the Ancestors',
            author: 'Kwame Asante',
            description: 'Exploring ancient African wisdom through oral traditions and storytelling.',
            coverImage: 'https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=400',
            duration: '45:32',
            audioUrl: '#',
            publishedAt: '2024-02-15T10:00:00.000Z',
            views: 1240,
            likes: 89
          },
          {
            id: 'p2',
            title: 'Ubuntu Philosophy Today',
            author: 'Amara Kone',
            description: 'How ancient African philosophy applies to modern community building.',
            coverImage: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400',
            duration: '38:15',
            audioUrl: '#',
            publishedAt: '2024-02-12T14:00:00.000Z',
            views: 892,
            likes: 67
          },
          {
            id: 'p3',
            title: 'The Griot Tradition',
            author: 'Fatima Okafor',
            description: 'Understanding the role of griots as keepers of African history and culture.',
            coverImage: 'https://images.pexels.com/photos/8828431/pexels-photo-8828431.jpeg?auto=compress&cs=tinysrgb&w=400',
            duration: '52:18',
            audioUrl: '#',
            publishedAt: '2024-02-10T16:00:00.000Z',
            views: 1456,
            likes: 112
          }
        ];
        
        setFeaturedPodcasts(mockPodcasts);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [storeUser]);

  // Auto-slide for hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide for latest updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLatestSlide((prev) => (prev + 1) % Math.ceil(latestContent.length / 3));
    }, 4000);
    return () => clearInterval(timer);
  }, [latestContent.length]);

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

  const togglePodcastPlay = (podcastId: string) => {
    setPlayingPodcast(playingPodcast === podcastId ? null : podcastId);
  };

  const nextLatestSlide = () => {
    setLatestSlide((prev) => (prev + 1) % Math.ceil(latestContent.length / 3));
  };

  const prevLatestSlide = () => {
    setLatestSlide((prev) => (prev - 1 + Math.ceil(latestContent.length / 3)) % Math.ceil(latestContent.length / 3));
  };

  const getVisibleLatestItems = () => {
    const itemsPerSlide = 3;
    const startIndex = latestSlide * itemsPerSlide;
    return latestContent.slice(startIndex, startIndex + itemsPerSlide);
  };

  // Don't render user-dependent content until component is mounted
  const shouldShowUserContent = isMounted;

  const heroSlides = [
    {
      title: "Discover the Rich Tapestry of African Stories",
      subtitle: "Immerse yourself in centuries of wisdom, folklore, and cultural heritage",
      image: "https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cta: "Explore Stories"
    },
    {
      title: "Listen to Ancient Wisdom Through Modern Podcasts",
      subtitle: "Experience African stories through immersive audio narratives",
      image: "https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cta: "Listen Now"
    },
    {
      title: "Join Our Growing Community of Storytellers",
      subtitle: "Share your stories and connect with fellow cultural preservationists",
      image: "https://images.pexels.com/photos/8828431/pexels-photo-8828431.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      cta: "Join Community"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="hero-section relative overflow-hidden h-screen">
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Carousel Images */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              {heroSlides[currentSlide].title.split(' ').map((word, index) => (
                <span key={index} className={index >= 5 ? "block" : ""} style={{ 
                  color: index >= 5 ? 'var(--color-secondary)' : 'white' 
                }}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
              {heroSlides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={currentSlide === 1 ? "/podcasts" : "/stories"}
                className="px-8 py-4 bg-white font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg"
                style={{ color: 'var(--color-primary)' }}
              >
                {currentSlide === 1 ? <Headphones size={20} /> : <BookOpen size={20} />}
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRight size={16} />
              </Link>
              
              {shouldShowUserContent && !user && (
                <Link
                  href="/auth/register"
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white transition-colors"
                  style={{ 
                    borderColor: 'white',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Join Our Community
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 vibrant-pattern-overlay" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--gradient-primary)' }}>
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>500+</h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>Stories & Articles</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--gradient-secondary)' }}>
                <Headphones className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>50+</h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>Audio Podcasts</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--gradient-success)' }}>
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>10k+</h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>Community Members</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>54</h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>African Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Podcasts Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Featured Podcasts
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
              Listen to captivating African stories and wisdom through our audio experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="podcast-card group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={podcast.coverImage} 
                    alt={podcast.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={256}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Play Button */}
                  <button
                    onClick={() => togglePodcastPlay(podcast.id)}
                    className="absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {playingPodcast === podcast.id ? (
                      <Pause className="text-white" size={20} />
                    ) : (
                      <Play className="text-white ml-1" size={20} />
                    )}
                  </button>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    {podcast.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {podcast.title}
                  </h3>
                  
                  <p className="mb-4 line-clamp-2" style={{ color: 'var(--color-textSecondary)' }}>
                    {podcast.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    <span>By {podcast.author}</span>
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
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/podcasts"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              <Headphones size={16} />
              <span>View All Podcasts</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 geometric-pattern-overlay" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Featured Stories
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
              Discover our most popular and engaging content, curated for you
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card rounded-lg shadow-md overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-card)' }}>
                  <div className="h-48" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                  <div className="p-6">
                    <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                    <div className="h-4 rounded w-2/3 mb-4" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="content-grid">
              {featuredContent.map((item) => (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="card group overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={item.coverImage} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={400}
                      height={192}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-white text-xs font-semibold rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)' }}>
                        {item.type}
                      </span>
                    </div>
                    {!item.isFree && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 text-white text-xs font-semibold rounded-full" style={{ background: 'var(--gradient-primary)' }}>
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 transition-colors line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                      {item.title}
                    </h3>
                    
                    <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <span className="flex items-center space-x-1">
                        <span>By {item.author}</span>
                      </span>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{formatNumber(item.likes)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{formatNumber(item.views)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/stories"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              <span>View All Stories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                Latest Updates
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
                Stay updated with the newest additions to our collection of African stories and cultural insights.
              </p>
            </div>
            
            {/* Latest Content Slider */}
            <div className="relative">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card rounded-lg shadow-md overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-card)' }}>
                      <div className="h-48" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                      <div className="p-6">
                        <div className="h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                        <div className="h-4 rounded w-2/3 mb-4" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                        <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--color-backgroundTertiary)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {getVisibleLatestItems().map((item) => (
                      <Link
                        key={item.id}
                        href={`/content/${item.id}`}
                        className="card group overflow-hidden transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: 'var(--color-card)' }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image 
                            src={item.coverImage} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            width={400}
                            height={192}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-white text-xs font-semibold rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)' }}>
                              {item.type}
                            </span>
                          </div>
                          {!item.isFree && (
                            <div className="absolute top-4 right-4">
                              <span className="px-2 py-1 text-white text-xs font-semibold rounded-full" style={{ background: 'var(--gradient-primary)' }}>
                                Premium
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 transition-colors line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                            {item.title}
                          </h3>
                          
                          <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                            <span>By {item.author}</span>
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <Heart size={14} />
                                <span>{formatNumber(item.likes)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{formatNumber(item.views)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Slider Controls */}
                  {latestContent.length > 3 && (
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={prevLatestSlide}
                        className="p-3 rounded-full transition-colors hover:scale-110"
                        style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                      >
                        <ChevronLeft size={20} style={{ color: 'var(--color-textPrimary)' }} />
                      </button>
                      
                      <div className="flex space-x-2">
                        {Array.from({ length: Math.ceil(latestContent.length / 3) }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setLatestSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === latestSlide ? 'scale-125' : ''
                            }`}
                            style={{ 
                              backgroundColor: index === latestSlide ? 'var(--color-primary)' : 'var(--color-border)' 
                            }}
                          />
                        ))}
                      </div>
                      
                      <button
                        onClick={nextLatestSlide}
                        className="p-3 rounded-full transition-colors hover:scale-110"
                        style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
                      >
                        <ChevronRight size={20} style={{ color: 'var(--color-textPrimary)' }} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/articles"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <span>View All Articles</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Categories Section */}
      <section className="py-16 earth-texture-overlay" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Explore by Category
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
              Dive into different types of African content and experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Traditional Stories',
                description: 'Ancient folktales and legends passed down through generations',
                icon: BookOpen,
                href: '/stories',
                color: 'var(--color-primary)',
                count: '200+'
              },
              {
                title: 'Audio Podcasts',
                description: 'Immersive audio experiences bringing stories to life',
                icon: Headphones,
                href: '/podcasts',
                color: 'var(--color-secondary)',
                count: '50+'
              },
              {
                title: 'Cultural Articles',
                description: 'In-depth analysis of African culture and traditions',
                icon: FileText,
                href: '/articles',
                color: 'var(--color-success)',
                count: '150+'
              },
              {
                title: 'Historical Books',
                description: 'Comprehensive books on African history and heritage',
                icon: Users,
                href: '/books',
                color: 'var(--color-info)',
                count: '100+'
              }
            ].map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="category-card group p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${category.color}20` }}>
                  <category.icon size={32} style={{ color: category.color }} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                  {category.title}
                </h3>
                
                <p className="mb-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                  {category.description}
                </p>
                
                <div className="inline-flex items-center space-x-2 text-sm font-medium" style={{ color: category.color }}>
                  <span>{category.count} items</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ background: 'var(--gradient-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'white', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
            Join Our Storytelling Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)' }}>
            Share your stories, connect with fellow storytellers, and help preserve African cultural heritage for future generations.
          </p>
          
          {shouldShowUserContent && !user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Create Free Account
              </Link>
              <Link
                href="/subscription"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white transition-colors"
                style={{ 
                  borderColor: 'white',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                View Subscription Plans
              </Link>
            </div>
          ) : shouldShowUserContent && user ? (
            <Link
              href="/subscription"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              <Star size={20} />
              <span>Upgrade Your Experience</span>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}