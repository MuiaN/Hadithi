'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  User, 
  Clock, 
  Tag, 
  Heart, 
  MessageCircle, 
  Eye,
  Link2,
  Edit,
  Music,
  Book,
  Image as ImageIcon
} from 'lucide-react'; // Assuming you have icons for other content types

interface RelatedContentItem {
  id: string;
  title: string;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  status: string;
  chapterNumber: number | null;
  coverImage: string | null;
}

// Define the type for our content data
interface ContentData {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string | null;
  readingTime: string | null;
  duration: string | null;
  audioFile: string | null;
  createdAt: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string | null;
  };
  tags: { name: string }[];
  series: { id: string; title: string } | null;
  gallery: { id: string; title: string; createdAt: string; images: { url: string }[] } | null;
  linkedPodcast: { id: string; title: string; createdAt: string; coverImage: string | null; } | null;
  _count: {
    likes: number;
    comments: number;
  };
  views: number;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  relatedContent: RelatedContentItem[];
}

export default function CreatorContentViewPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/v1/creator/content/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch content');
        }
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>Loading content...</div>;
  }

  if (!content) {
    return notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_APPROVAL': return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      case 'REJECTED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSimpleDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Specific layout for Podcasts
  if (content.type === 'PODCAST') {
    return (
      // Removed top padding for a cleaner look
      <main className="main-content-with-sidebar" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cover Art */}
              <div className="md:col-span-1">
                {content.coverImage && (
                  <Image 
                    src={content.coverImage} 
                    alt={content.title} 
                    width={400} 
                    height={400} 
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                    priority
                  />
                )}
              </div>

              {/* Podcast Info & Player */}
              <div className="md:col-span-2 flex flex-col">
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {content.title}
                </h1>
                <div className="flex items-center space-x-2 text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                  <User size={14} />
                  <span>{content.author.name}</span>
                  <span className="mx-1">·</span>
                  {content.duration && <><Clock size={14} /><span>{content.duration}</span></>}
                </div>
                <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
                  {content.description}
                </p>

                {/* Audio Player */}
                {content.audioFile && (
                  <div className="w-full mt-auto">
                    <audio controls className="w-full">
                      <source src={content.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Show Notes / Content */}
          <div className="mt-8 p-8 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Show Notes</h2>
            <div 
              className="prose max-w-none"
              style={{ color: 'var(--color-textPrimary)' }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>

          {/* Footer Section */}
          <footer className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag size={16} className="mt-1" style={{ color: 'var(--color-textSecondary)' }} />
                {content.tags.map(tag => (
                  <span key={tag.name} className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: 'var(--color-backgroundTertiary)', color: 'var(--color-textSecondary)' }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center space-x-6" style={{ color: 'var(--color-textSecondary)' }}>
                <div className="flex items-center space-x-2"><Heart /> <span>{content._count.likes} Likes</span></div>
                <div className="flex items-center space-x-2"><MessageCircle /> <span>{content._count.comments} Comments</span></div>
                <div className="flex items-center space-x-2"><Eye /> <span>{content.views} Plays</span></div>
              </div>
              <Link href={`/creator/edit/${content.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Link>
            </div>
          </footer>
        </div>
      </main>
    );
  }

  // Default layout for Story, Article, Book
  return (
    // Use a more granular grid for better layout control
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <article className="lg:col-span-8">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold my-4 leading-tight" style={{ color: 'var(--color-textPrimary)' }}>
            {content.title}
          </h1>
          <p className="text-lg md:text-xl mt-2" style={{ color: 'var(--color-textSecondary)' }}>
            {content.description}
          </p>
        </header>

        {/* Series Information - New Modern Design */}
        {content.series && (
          <div className="mb-8 p-4 rounded-lg flex items-center space-x-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <Book size={24} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0" />
            <div>
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Part of the series</span>
              <p className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>{content.series.title}</p>
            </div>
          </div>
        )}

        {/* Author and Meta Info */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <Image 
              src={content.author.avatar || '/default-avatar.png'} 
              alt={content.author.name} 
              width={48} 
              height={48} 
              className="rounded-full"
            />
            <div>
              <p className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>{content.author.name}</p>
              <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                {content.publishedAt 
                  ? `Published on ${new Date(content.publishedAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                  : `Created on ${new Date(content.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            {content.readingTime && <div className="flex items-center space-x-1"><Clock size={14} /><span>{content.readingTime}</span></div>}
            <div className="flex items-center space-x-1"><Eye size={14} /><span>{content.views} views</span></div>
          </div>
        </div>

        {/* Cover Image */}
        {content.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image 
              src={content.coverImage} 
              alt={content.title} 
              width={1200} 
              height={600} 
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Main Content */}
        <div 
          className="prose lg:prose-xl max-w-none"
          style={{ color: 'var(--color-textPrimary)' }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        {/* Footer Section */}
        <footer className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {/* Tags */}
          {content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag size={16} className="mt-1" style={{ color: 'var(--color-textSecondary)' }} />
              {content.tags.map(tag => (
                <span key={tag.name} className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: 'var(--color-backgroundTertiary)', color: 'var(--color-textSecondary)' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-6" style={{ color: 'var(--color-textSecondary)' }}>
              <div className="flex items-center space-x-2"><Heart /> <span>{content._count.likes} Likes</span></div>
              <div className="flex items-center space-x-2"><MessageCircle /> <span>{content._count.comments} Comments</span></div>
            </div>
            <Link href={`/creator/edit/${content.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Content
            </Link>
          </div>
        </footer>
      </article>

      {/* Right Sidebar for Associated Content */}
      <aside className="lg:col-span-4 space-y-6 sticky top-8 self-start">
        {content.series && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              <Book className="inline-block mr-2" size={20} /> In this series
            </h3>
            <p className="mb-4 font-medium" style={{ color: 'var(--color-primary)' }}>{content.series.title}</p>
            <ul className="space-y-4">
              {content.relatedContent.map(item => (
                <li key={item.id}>
                  <Link href={`/creator/content/${item.id}`} className="flex items-center space-x-3 group">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.coverImage || '/images/placeholder.png'}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-[var(--color-primary)]" style={{ color: 'var(--color-textPrimary)' }}>
                        {item.chapterNumber && `Ch. ${item.chapterNumber}: `}{item.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ').toLowerCase()}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                          {item.type.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.linkedPodcast && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-textPrimary)'}}>
              <Music className="inline-block mr-2" size={20} /> Linked Podcast
            </h3>
            <div className="flex space-x-4">
              <Image
                src={content.linkedPodcast.coverImage || '/images/placeholder.png'}
                alt={content.linkedPodcast.title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--color-textPrimary)' }}>{content.linkedPodcast.title}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>Created: {formatSimpleDate(content.linkedPodcast.createdAt)}</p>
                <Link href={`/creator/podcast/${content.linkedPodcast.id}`} className="inline-block mt-2 px-3 py-1 text-xs rounded-lg whitespace-nowrap" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  View
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Linked Gallery - New Modern Design */}

        {content.gallery && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--color-textPrimary)'}}>
              <ImageIcon className="inline-block mr-2" size={20} /> Linked Gallery
            </h3>
            <div className="flex space-x-4">
              {content.gallery.images && content.gallery.images.length > 0 ? (
                <Image
                  src={content.gallery.images[0].url}
                  alt={content.gallery.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)'}}><ImageIcon size={32} style={{ color: 'var(--color-textSecondary)' }} /></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--color-textPrimary)' }}>{content.gallery.title}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>Created: {formatSimpleDate(content.gallery.createdAt)}</p>
                <Link href={`/creator/gallery/${content.gallery.id}`} className="inline-block mt-2 px-3 py-1 text-xs rounded-lg whitespace-nowrap" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
}
