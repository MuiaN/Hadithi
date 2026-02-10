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
} from 'lucide-react';

interface RelatedContentItem {
  id: string;
  title: string;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  status: string;
  chapterNumber: number | null;
  coverImage: string | null;
}

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

export default function ArticleViewPage({ params }: { params: { id: string } }) {
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

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <article className="lg:col-span-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold my-4 leading-tight" style={{ color: 'var(--color-textPrimary)' }}>
            {content.title}
          </h1>
          <p className="text-lg md:text-xl mt-2" style={{ color: 'var(--color-textSecondary)' }}>
            {content.description}
          </p>
        </header>

        {content.series && (
          <div className="mb-8 p-4 rounded-lg flex items-center space-x-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <Book size={24} style={{ color: 'var(--color-primary)' }} className="flex-shrink-0" />
            <div>
              <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>Part of the series</span>
              <p className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>{content.series.title}</p>
            </div>
          </div>
        )}

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

        <div 
          className="prose lg:prose-xl max-w-none"
          style={{ color: 'var(--color-textPrimary)' }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        <footer className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
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
            </div>
            <Link href={`/creator/articles/edit/${content.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Article
            </Link>
          </div>
        </footer>
      </article>

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
                  <Link href={item.type === 'ARTICLE' ? `/creator/articles/${item.id}` : `/creator/content/${item.id}`} className="flex items-center space-x-3 group">
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
