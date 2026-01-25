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
  Edit,
  Link2,
  CheckCircle,
  XCircle,
  AlertCircle,  
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
  linkedFromContent: { id: string; title: string }[];
}

export default function CreatorPodcastViewPage({ params }: { params: { id:string } }) {
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/v1/creator/content/${params.id}`);
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
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>Loading podcast...</div>;
  }

  if (!podcast) {
    return notFound();
  }

  const StatusBadge = ({ status }: { status: PodcastData['status'] }) => {
    const statusInfo = {
      PUBLISHED: { text: 'Published', icon: <CheckCircle size={14} />, color: 'var(--color-success)' },
      PENDING_APPROVAL: { text: 'In Review', icon: <Clock size={14} />, color: 'var(--color-info)' },
      DRAFT: { text: 'Draft', icon: <Edit size={14} />, color: 'var(--color-textSecondary)' },
      REJECTED: { text: 'Rejected', icon: <XCircle size={14} />, color: 'var(--color-error)' },
      ARCHIVED: { text: 'Archived', icon: <AlertCircle size={14} />, color: 'var(--color-warning)' },
    }[status] || { text: 'Unknown', icon: <AlertCircle size={14} />, color: 'var(--color-textSecondary)' };

    return (
      <div 
        className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: 'var(--color-card)', color: statusInfo.color, border: `1px solid ${statusInfo.color}` }}
      >
        {statusInfo.icon}
        <span>{statusInfo.text}</span>
      </div>
    );
  };

  return (
    <div className="w-full" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Spotify-style Header */}
      <header 
        className="relative p-8 flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6"
        style={{
          background: `linear-gradient(to bottom, var(--color-primary) 0%, var(--color-background) 80%)`,
          minHeight: '300px',
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `linear-gradient(to bottom, var(--color-primary) 0%, var(--color-background) 100%)`,
            opacity: 0.8,
          }}
        />
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6">
        {podcast.coverImage && (
          <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden">
            <Image 
              src={podcast.coverImage} 
              alt={podcast.title} 
              width={224} 
              height={224} 
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-end text-center md:text-left">
          <p className="text-sm font-bold uppercase" style={{ color: 'var(--color-textPrimary)' }}>Podcast</p>
          <h1 className="text-4xl md:text-6xl font-extrabold my-2 leading-tight" style={{ color: 'var(--color-textPrimary)', textShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}>
            {podcast.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-sm mt-4" style={{ color: 'var(--color-textSecondary)' }}>
            <div className="flex items-center space-x-2">
              <Image src={podcast.author.avatar || '/default-avatar.png'} alt={podcast.author.name} width={24} height={24} className="rounded-full" />
              <span className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>{podcast.author.name}</span>
            </div>
            <span className="mx-1">·</span>
            <span>
              {podcast.publishedAt ? `Published ${new Date(podcast.publishedAt).toLocaleDateString()}` : `Created ${new Date(podcast.createdAt).toLocaleDateString()}`}
            </span>
            {podcast.duration && <><span className="mx-1">·</span><span>{podcast.duration}</span></>}
          </div>
        </div>
        </div>
        <StatusBadge status={podcast.status} />
      </header>

      {/* Main Content Area */}
      <div className="p-8">
        {/* Audio Player */}
        {podcast.audioFile && (
          <div className="mb-8">
            <audio key={podcast.audioFile} controls className="w-full">
              <source src={podcast.audioFile} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full">
          {/* Episode Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Episode Description</h2>
            <p className="text-base" style={{ color: 'var(--color-textSecondary)', whiteSpace: 'pre-wrap' }}>
              {podcast.description}
            </p>
          </div>

          {/* Show Notes */}
          <div className="mb-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Show Notes</h2>
            <div
              className="prose max-w-none"
              style={{ color: 'var(--color-textPrimary)' }}
              dangerouslySetInnerHTML={{ __html: podcast.content }}
            />
          </div>

          {/* Footer Section */}
          <footer className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {/* Linked From Content */}
            {podcast.linkedFromContent && podcast.linkedFromContent.length > 0 && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2" style={{ color: 'var(--color-textPrimary)' }}>
                  <Link2 size={18} />
                  <span>Linked From</span>
                </h3>
                <ul className="space-y-2">
                  {podcast.linkedFromContent.map(content => (
                    <li key={content.id}>
                      <Link href={`/creator/content/${content.id}`} className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
                        {content.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                <div className="flex items-center space-x-2"><Eye /> <span>{podcast.views} Plays</span></div>
              </div>
              <Link href={`/creator/podcast/edit/${podcast.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
