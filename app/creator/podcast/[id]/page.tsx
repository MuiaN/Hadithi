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
  Edit,
  Link2,
  CheckCircle,
  Book,
  Music
} from 'lucide-react';

interface PodcastData {
  id: string;
  title: string;
  description: string;
  content: string; // For show notes
  coverImage: string | null;
  duration: string | null;
  audioFile: string | null; // Path to the audio file
  createdAt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_APPROVAL' | 'REJECTED';
  publishedAt: string;
  author: {
    name: string;
    avatar: string | null;
  };
  tags: { name: string }[];
  _count: {
    likes: number;
    comments: number;
  };
  views: number;
  linkedFromContent: { id: string; title: string; slug?: string | null; type: 'STORY' | 'ARTICLE' | 'BOOK' | 'PODCAST' }[];
}

export default function CreatorPodcastViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/v1/creator/content/${id}`);
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error('Failed to fetch podcast');
        }
        const data = await res.json();
        if (data.type !== 'PODCAST') {
          // Redirect or show error if it's not a podcast
          notFound();
        }
        setPodcast(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>Loading podcast...</div>;
  }

  if (!podcast) {
    return notFound();
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <article className="lg:col-span-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight" style={{ color: 'var(--color-textPrimary)' }}>
            {podcast.title}
          </h1>
          <p className="text-lg md:text-xl mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {podcast.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
            <div className="flex items-center space-x-2">
              <Image 
                src={podcast.author.avatar || '/default-avatar.png'} 
                alt={podcast.author.name} 
                width={24} 
                height={24} 
                className="rounded-full"
              />
              <span className="font-medium" style={{ color: 'var(--color-textPrimary)' }}>{podcast.author.name}</span>
            </div>
            
            <span className="text-gray-300 dark:text-gray-600">•</span>
            
            <span>
              {podcast.publishedAt 
                ? new Date(podcast.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : new Date(podcast.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              }
            </span>

            {podcast.duration && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{podcast.duration}</span>
                </div>
              </>
            )}

            <span className="text-gray-300 dark:text-gray-600">•</span>
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{podcast.views} plays</span>
            </div>
          </div>
        </header>

        {/* Audio Player */}
        {podcast.audioFile && (
          <div className="mb-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <audio key={podcast.audioFile} controls className="w-full">
              <source src={podcast.audioFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {podcast.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <Image 
                src={podcast.coverImage} 
                alt={podcast.title} 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Show Notes</h2>
            <div
              className="prose dark:prose-invert max-w-none [&_p]:min-h-[1em]"
              style={{ color: 'var(--color-textPrimary)' }}
              dangerouslySetInnerHTML={{ __html: podcast.content }}
            />
        </div>

        <footer className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {podcast.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag size={16} className="mt-1" style={{ color: 'var(--color-textSecondary)' }} />
              {podcast.tags.map(tag => (
                <span key={tag.name} className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: 'var(--color-backgroundTertiary)', color: 'var(--color-textSecondary)' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-6" style={{ color: 'var(--color-textSecondary)' }}>
              <div className="flex items-center space-x-2"><Heart /> <span>{podcast._count.likes} Likes</span></div>
              <div className="flex items-center space-x-2"><MessageCircle /> <span>{podcast._count.comments} Comments</span></div>
            </div>
            <Link href={`/creator/podcast/edit/${podcast.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Podcast
            </Link>
          </div>
        </footer>
      </article>

      <aside className="lg:col-span-4 space-y-6 sticky top-8 self-start">
        {/* Linked From Content */}
            {podcast.linkedFromContent && podcast.linkedFromContent.length > 0 && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2" style={{ color: 'var(--color-textPrimary)' }}>
                  <Link2 size={18} />
                  <span>Linked From</span>
                </h3>
                <ul className="space-y-2">
                  {podcast.linkedFromContent.map(content => (
                    <li key={content.id}>
                      <Link href={
                        content.type === 'STORY' ? `/creator/story/${content.slug || content.id}` :
                        content.type === 'ARTICLE' ? `/creator/articles/${content.slug || content.id}` :
                        content.type === 'BOOK' ? `/creator/books/${content.slug || content.id}` :
                        content.type === 'PODCAST' ? `/creator/podcast/${content.slug || content.id}` :
                        '#'
                      } className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
                        {content.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
      </aside>
    </main>
  );
}
