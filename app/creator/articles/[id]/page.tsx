'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
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
  Image as ImageIcon,
  Youtube
} from 'lucide-react';

interface RelatedContentItem {
  id: string;
  title: string;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  status: string;
  chapterNumber: number | null;
  coverImage: string | null;
  slug?: string | null;
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
  gallery: { id: string; title: string; createdAt: string; images: { url: string }[]; slug?: string | null } | null;
  linkedPodcast: { id: string; title: string; createdAt: string; coverImage: string | null; slug?: string | null } | null;
  _count: {
    likes: number;
    comments: number;
  };
  views: number;
  type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST';
  relatedContent: RelatedContentItem[];
  slug?: string | null;
  youtubeUrls: string[];
  citations: string | null;
}

export default function ArticleViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/v1/creator/content/${id}`);
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
  }, [id]);

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

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const YoutubeVideo = ({ url }: { url: string }) => {
    const [title, setTitle] = useState<string>('');
    const embedUrl = getYoutubeEmbedUrl(url);

    useEffect(() => {
      const fetchInfo = async () => {
        try {
          const res = await fetch(`https://noembed.com/embed?url=${url}`);
          const data = await res.json();
          if (data.title) setTitle(data.title);
        } catch (e) {
          console.error('Failed to fetch youtube info', e);
        }
      };
      fetchInfo();
    }, [url]);

    if (!embedUrl) return null;

    return (
      <div className="mb-8">
        <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || 'YouTube video'}
          />
        </div>
        {title && <p className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>{title}</p>}
      </div>
    );
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <article className="lg:col-span-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight" style={{ color: 'var(--color-textPrimary)' }}>
            {content.title}
          </h1>
          <p className="text-lg md:text-xl mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {content.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <div className="flex items-center space-x-2">
              <Image 
                src={content.author.avatar || '/default-avatar.png'} 
                alt={content.author.name} 
                width={24} 
                height={24} 
                className="rounded-full"
              />
              <span className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>{content.author.name}</span>
            </div>
            
            <span className="text-gray-300 dark:text-gray-600">•</span>
            
            <span>
              {content.publishedAt 
                ? new Date(content.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : new Date(content.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              }
            </span>

            {content.readingTime && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{content.readingTime}</span>
                </div>
              </>
            )}

            <span className="text-gray-300 dark:text-gray-600">•</span>
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{content.views} views</span>
            </div>

            {content.series && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Book size={14} />
                  <span>Series: {content.series.title}</span>
                </div>
              </>
            )}
          </div>
        </header>

        {content.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <Image 
                src={content.coverImage} 
                alt={content.title} 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div 
          className="prose lg:prose-xl dark:prose-invert max-w-none [&_p]:min-h-[1em]"
          style={{ color: 'var(--color-textPrimary)' }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        {content.youtubeUrls && content.youtubeUrls.length > 0 && (
          <div className="mt-8">
            {content.youtubeUrls.map((url, idx) => <YoutubeVideo key={idx} url={url} />)}
          </div>
        )}

        {content.citations && (
          <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Citations & References</h3>
            <div 
              className="prose dark:prose-invert max-w-none text-sm [&_p]:min-h-[1em]"
              style={{ color: 'var(--color-textSecondary)' }}
              dangerouslySetInnerHTML={{ __html: content.citations }}
            />
          </div>
        )}

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
            <Link href={`/creator/articles/edit/${content.slug || content.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
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
                  <Link href={
                    item.type === 'STORY' ? `/creator/story/${item.slug || item.id}` :
                    item.type === 'ARTICLE' ? `/creator/articles/${item.slug || item.id}` :
                    item.type === 'BOOK' ? `/creator/books/${item.slug || item.id}` :
                    item.type === 'PODCAST' ? `/creator/podcast/${item.slug || item.id}` :
                    '#'
                  } className="flex items-center space-x-3 group">
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
                <Link href={`/creator/podcast/${content.linkedPodcast.slug || content.linkedPodcast.id}`} className="inline-block mt-2 px-3 py-1 text-xs rounded-lg whitespace-nowrap" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
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
                <Link href={`/creator/galleries/${content.gallery.slug || content.gallery.id}`} className="inline-block mt-2 px-3 py-1 text-xs rounded-lg whitespace-nowrap" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
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
