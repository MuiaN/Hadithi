'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Eye, Calendar, Tag, User, Heart, Grid, List, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useGalleriesStore, Gallery } from '@/lib/store/galleriesStore';
import { usePublishedGalleries } from '@/hooks/usePublishedGalleries';
import { galleryAuthors } from '@/lib/mockData/galleries';
import useStore from '@/lib/store/useStore';

export default function GalleriesPage() {
  const publishedGalleries = usePublishedGalleries();
  const incrementViewCount = useGalleriesStore((state) => state.incrementViewCount);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('publishedAt');
  const { toast } = useToast();
  const { contentFilters, updateContentFilters } = useStore();

  // Extract all unique tags from galleries
  const allTags = Array.from(new Set(publishedGalleries.flatMap(gallery => gallery.tags))).sort();

  useEffect(() => {
    setLoading(false);
  }, []);

  // Filter and sort galleries
  const filteredGalleries = publishedGalleries
    .filter(gallery => {
      const matchesSearch = gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gallery.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                        selectedTags.some(tag => gallery.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.view_count - a.view_count;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'publishedAt':
          // Handle null values by treating them as very old dates
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
          return dateB - dateA;
        case 'images':
          return b.images.length - a.images.length;
        default:
          return 0;
      }
    });

  const openGallery = async (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(0);
    incrementViewCount(gallery.id);
    
    toast({
      title: "Gallery Opened",
      description: `Viewing ${gallery.title}`,
    });
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedGallery && selectedImageIndex < selectedGallery.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getAuthorInfo = (authorId?: string) => {
    if (!authorId) return null;
    return galleryAuthors[authorId as keyof typeof galleryAuthors] || null;
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('publishedAt');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
            <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>Loading galleries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Image Galleries
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Explore our curated collection of beautiful African image galleries showcasing wildlife, culture, and landscapes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search galleries by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <Tag size={16} className="mr-1" />
                Categories:
              </span>
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className="px-3 py-1 text-sm rounded-full transition-colors"
                  style={{
                    backgroundColor: selectedTags.includes(tag) 
                      ? 'var(--color-primary)' 
                      : 'var(--color-backgroundSecondary)',
                    color: selectedTags.includes(tag) 
                      ? 'white' 
                      : 'var(--color-textPrimary)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center space-x-4">
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

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium flex items-center" style={{ color: 'var(--color-textPrimary)' }}>
                  <Filter size={16} className="mr-1" />
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                >
                  <option value="publishedAt">Latest</option>
                  <option value="views">Most Viewed</option>
                  <option value="title">Title A-Z</option>
                  <option value="images">Most Images</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {filteredGalleries.length} galleries found
            {(searchQuery || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="ml-2 text-sm underline hover:no-underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Galleries List/Grid */}
        {filteredGalleries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <ImageIcon size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No galleries found
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or filters to find more galleries.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => {
              const author = getAuthorInfo(gallery.created_by);
              
              return (
                <Card
                  key={gallery.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  style={{ backgroundColor: 'var(--color-card)' }}
                  onClick={() => openGallery(gallery)}
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {gallery.images.length > 0 ? (
                      <>
                        <Image
                          src={gallery.images[0].url}
                          alt={gallery.images[0].alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={225}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Eye className="w-8 h-8" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full" style={{ color: 'var(--color-textSecondary)' }}>
                        No images
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        className="shadow-sm font-medium text-white"
                        style={{ 
                          background: 'var(--gradient-primary)'
                        }}
                      >
                        {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                      {gallery.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                      {gallery.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(gallery.view_count)}</span>
                          </div>
                          {gallery.published_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(gallery.published_at)}</span>
                            </div>
                          )}
                        </div>
                        {author && (
                          <div className="flex items-center gap-1 text-xs">
                            <User className="w-3 h-3" />
                            <span>{author.name}</span>
                          </div>
                        )}
                      </div>
                      {gallery.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {gallery.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {gallery.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{gallery.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="space-y-6">
            {filteredGalleries.map((gallery) => {
              const author = getAuthorInfo(gallery.created_by);
              
              return (
                <Card
                  key={gallery.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ backgroundColor: 'var(--color-card)' }}
                  onClick={() => openGallery(gallery)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 md:flex-shrink-0">
                      <div className="aspect-video md:aspect-square md:h-full bg-gray-200 relative overflow-hidden">
                        {gallery.images.length > 0 ? (
                          <Image
                            src={gallery.images[0].url}
                            alt={gallery.images[0].alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={256}
                            height={256}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full" style={{ color: 'var(--color-textSecondary)' }}>
                            No images
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge 
                            className="shadow-sm font-medium"
                            style={{ 
                              backgroundColor: 'var(--color-primary)',
                              color: 'white'
                            }}
                          >
                            {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                          Gallery
                        </span>
                        <span className="flex items-center text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                          <Calendar size={12} className="mr-1" />
                          {formatDate(gallery.published_at)}
                        </span>
                        <span className="flex items-center text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                          <Eye size={12} className="mr-1" />
                          {formatNumber(gallery.view_count)} views
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold group-hover:text-amber-600 transition-colors mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                        {gallery.title}
                      </h3>
                      
                      <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                        {gallery.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          {author && (
                            <span className="flex items-center space-x-1">
                              <User size={14} />
                              <span>By {author.name}</span>
                            </span>
                          )}
                        </div>
                        
                        {gallery.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {gallery.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {gallery.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{gallery.tags.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Gallery Modal */}
        <Dialog open={!!selectedGallery} onOpenChange={closeGallery}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0" style={{ backgroundColor: 'var(--color-card)' }}>
            {selectedGallery && (
              <>
                {/* Header with close button */}
                <div className="sticky top-0 z-50 flex items-center justify-between p-6 border-b" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                  <DialogHeader className="flex-1">
                    <DialogTitle className="text-2xl" style={{ color: 'var(--color-textPrimary)' }}>
                      {selectedGallery.title}
                    </DialogTitle>
                  </DialogHeader>
                  <button
                    onClick={closeGallery}
                    className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    style={{ color: 'var(--color-textSecondary)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {selectedGallery.description && (
                    <p style={{ color: 'var(--color-textSecondary)' }}>{selectedGallery.description}</p>
                  )}

                  {selectedGallery.images.length > 0 && (
                    <div className="space-y-4">
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={selectedGallery.images[selectedImageIndex].url}
                          alt={selectedGallery.images[selectedImageIndex].alt}
                          className="w-full h-auto max-h-[60vh] object-contain"
                          width={800}
                          height={600}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          Image {selectedImageIndex + 1} of {selectedGallery.images.length}
                        </p>
                        {selectedGallery.images[selectedImageIndex].caption && (
                          <p className="mt-2" style={{ color: 'var(--color-textPrimary)' }}>
                            {selectedGallery.images[selectedImageIndex].caption}
                          </p>
                        )}
                      </div>

                      {selectedGallery.images.length > 1 && (
                        <div className="grid grid-cols-6 gap-2">
                          {selectedGallery.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                index === selectedImageIndex
                                  ? 'ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              style={{ 
                                borderColor: index === selectedImageIndex ? 'var(--color-primary)' : 'var(--color-border)'
                              }}
                            >
                              <Image
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                width={100}
                                height={100}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedGallery.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedGallery.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm pt-4 border-t" style={{ color: 'var(--color-textSecondary)', borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(selectedGallery.view_count)} views</span>
                    </div>
                    {selectedGallery.published_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Published {formatDate(selectedGallery.published_at)}</span>
                      </div>
                    )}
                    {getAuthorInfo(selectedGallery.created_by) && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>By {getAuthorInfo(selectedGallery.created_by)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}