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
  ChevronDown,
  ChevronRight,
  FileText
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

interface Chapter {
  id: string;
  title: string;
  content: string;
  subChapters: Chapter[];
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
  chapters?: Chapter[];
  slug?: string | null;
}

// Helper to find a chapter by ID recursively
const findChapter = (chapters: Chapter[], id: string): Chapter | undefined => {
  for (const chapter of chapters) {
    if (chapter.id === id) return chapter;
    if (chapter.subChapters) {
      const found = findChapter(chapter.subChapters, id);
      if (found) return found;
    }
  }
  return undefined;
};

// Helper to find the path to a chapter
const findChapterPath = (chapters: Chapter[], targetId: string, currentPath: string[] = []): string[] | null => {
  for (const chapter of chapters) {
    if (chapter.id === targetId) {
      return [...currentPath, chapter.id];
    }
    if (chapter.subChapters && chapter.subChapters.length > 0) {
      const path = findChapterPath(chapter.subChapters, targetId, [...currentPath, chapter.id]);
      if (path) return path;
    }
  }
  return null;
};

// Helper to get chapter numbering
const getChapterNumbering = (chapters: Chapter[], targetId: string, parentIndexStr: string = ''): string | null => {
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const numbering = parentIndexStr ? `${parentIndexStr}.${i + 1}` : `${i + 1}`;
    
    if (chapter.id === targetId) return numbering;
    
    if (chapter.subChapters && chapter.subChapters.length > 0) {
      const found = getChapterNumbering(chapter.subChapters, targetId, numbering);
      if (found) return found;
    }
  }
  return null;
};

export default function BookViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null); // null means Introduction

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

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const handleChapterClick = (chapter: Chapter) => {
    setActiveChapterId(chapter.id);
    if (content?.chapters) {
      const path = findChapterPath(content.chapters, chapter.id);
      if (path) {
        const newExpanded: Record<string, boolean> = {};
        path.forEach(id => { newExpanded[id] = true; });
        setExpandedChapters(newExpanded);
      }
    }
  };

  const handleIntroductionClick = () => {
    setActiveChapterId(null);
    setExpandedChapters({});
  };

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

  const renderSidebarChapter = (chapter: Chapter, index: number, parentIndexStr: string = '') => {
    const numbering = parentIndexStr ? `${parentIndexStr}.${index + 1}` : `${index + 1}`;
    const isExpanded = expandedChapters[chapter.id];
    const isActive = activeChapterId === chapter.id;
    const hasSubChapters = chapter.subChapters && chapter.subChapters.length > 0;

    return (
      <div key={chapter.id} className="mb-1">
        <div 
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-backgroundSecondary)] text-[var(--color-textPrimary)]'}`}
          onClick={() => handleChapterClick(chapter)}
        >
          {hasSubChapters ? (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleChapter(chapter.id); }}
              className={`mr-2 p-0.5 rounded-full hover:bg-black/10 ${isActive ? 'text-white' : 'text-[var(--color-textSecondary)]'}`}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-6"></span>
          )}
          <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
            <span className={`mr-2 ${isActive ? 'text-white/80' : 'text-[var(--color-textSecondary)]'}`}>{numbering}</span>
            {chapter.title}
          </span>
        </div>

        {hasSubChapters && isExpanded && (
          <div className="ml-4 mt-1 border-l border-[var(--color-border)] pl-2">
            {chapter.subChapters.map((sub, idx) => renderSidebarChapter(sub, idx, numbering))}
          </div>
        )}
      </div>
    );
  };

  const activeChapter = content?.chapters && activeChapterId ? findChapter(content.chapters, activeChapterId) : null;
  const activeChapterNumbering = content?.chapters && activeChapterId ? getChapterNumbering(content.chapters, activeChapterId) : null;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Main Section */}
      <div className="lg:col-span-8">
        <div className="mb-8 p-8 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--color-card)' }}>
          {/* Header */}
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

          {/* TOC + Content */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Internal Sidebar: Table of Contents */}
            <aside className="md:w-64 flex-shrink-0 border-r pr-6" style={{ borderColor: 'var(--color-border)' }}>
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-textSecondary)' }}>Table of Contents</h3>
                
                {/* Introduction Link */}
                <div 
                  className={`flex items-center py-2 px-3 mb-1 rounded-lg cursor-pointer transition-colors ${activeChapterId === null ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-backgroundSecondary)] text-[var(--color-textPrimary)]'}`}
                  onClick={handleIntroductionClick}
                >
                  <span className="w-6 flex justify-center"><FileText size={14} /></span>
                  <span className="text-sm font-medium">Introduction</span>
                </div>

                {/* Chapters Tree */}
                {content.chapters && content.chapters.map((chapter, index) => renderSidebarChapter(chapter, index))}
              </div>
            </aside>

            {/* Reading Area */}
            <article className="flex-1 min-w-0">
              {activeChapterId === null ? (
                // Introduction View
                content.content ? (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-textPrimary)' }}>Introduction</h2>
                    <div 
                      className="prose lg:prose-xl dark:prose-invert max-w-none [&_p]:min-h-[1em]"
                      style={{ color: 'var(--color-textPrimary)' }}
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">No introduction content available.</div>
                )
              ) : (
                // Chapter View
                activeChapter ? (
                  <div className="animate-in fade-in duration-300">
                    {activeChapterNumbering && (
                      <div className="flex flex-col items-center justify-center mb-6">
                        {activeChapterNumbering.includes('.') ? (
                          <>
                            <span className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                              Chapter {activeChapterNumbering.split('.')[0]}
                            </span>
                            <span className="text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-primary)' }}>
                              Sub-chapter {activeChapterNumbering}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-primary)' }}>
                            Chapter {activeChapterNumbering}
                          </span>
                        )}
                      </div>
                    )}
                    <h1 className="text-3xl font-bold mb-8 pb-4 border-b text-center" style={{ color: 'var(--color-textPrimary)', borderColor: 'var(--color-border)' }}>
                      {activeChapter.title}
                    </h1>
                    <div 
                      className="prose lg:prose-xl dark:prose-invert max-w-none [&_p]:min-h-[1em]"
                      style={{ color: 'var(--color-textPrimary)' }}
                      dangerouslySetInnerHTML={{ __html: activeChapter.content }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">Chapter not found</div>
                )
              )}
            </article>
          </div>

          <footer className="pt-8 mt-12 border-t" style={{ borderColor: 'var(--color-border)' }}>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6" style={{ color: 'var(--color-textSecondary)' }}>
                <div className="flex items-center space-x-2"><Heart /> <span>{content._count.likes} Likes</span></div>
                <div className="flex items-center space-x-2"><MessageCircle /> <span>{content._count.comments} Comments</span></div>
              </div>
              <Link href={`/creator/books/edit/${content.slug || content.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Book
              </Link>
            </div>
          </footer>
        </div>
      </div>

      {/* Right Sidebar: Series & Linked Content */}
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
                  <Link 
                    href={
                      item.type === 'STORY' ? `/creator/story/${item.slug || item.id}` :
                      item.type === 'ARTICLE' ? `/creator/articles/${item.slug || item.id}` :
                      item.type === 'BOOK' ? `/creator/books/${item.slug || item.id}` :
                      item.type === 'PODCAST' ? `/creator/podcast/${item.slug || item.id}` :
                      '#'
                    } 
                    className="flex items-center space-x-3 group"
                  >
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
