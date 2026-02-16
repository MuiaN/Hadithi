'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { notFound, useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, Eye, Tag, CheckCircle, XCircle, AlertCircle, Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  alt: string;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING_APPROVAL' | 'REJECTED' | 'ARCHIVED';
  createdAt: string;
  tags: string[];
  viewCount: number;
  author: {
    name: string;
    avatar: string | null;
  };
}

export default function GalleryViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchGallery = async () => {
      try {
        const res = await fetch(`/api/v1/creator/galleries/${id}`);
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error('Failed to fetch gallery');
        }
        const data = await res.json();
        setGallery(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [isLightboxOpen]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const showNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!gallery) return;
    setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length);
  };
  const showPrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!gallery) return;
    setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/creator/galleries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete gallery');
      
      toast({
        title: 'Success',
        description: 'Gallery deleted successfully',
      });
      router.push('/creator/galleries');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete gallery',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  if (!gallery) {
    return notFound();
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const StatusBadge = ({ status }: { status: string }) => {
    const statusInfo = {
      PUBLISHED: { text: 'Published', icon: <CheckCircle size={14} />, color: 'var(--color-success)' },
      PENDING_APPROVAL: { text: 'In Review', icon: <Clock size={14} />, color: 'var(--color-info)' },
      DRAFT: { text: 'Draft', icon: <Edit size={14} />, color: 'var(--color-textSecondary)' },
      REJECTED: { text: 'Rejected', icon: <XCircle size={14} />, color: 'var(--color-error)' },
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
      {/* Modern Header */}
      <header 
        className="relative p-8 flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6"
        style={{
          background: `linear-gradient(to bottom, var(--color-secondary) 0%, var(--color-background) 80%)`,
          minHeight: '300px',
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `linear-gradient(to bottom, var(--color-secondary) 0%, var(--color-background) 100%)`,
            opacity: 0.8,
          }}
        />
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden bg-[var(--color-card)] flex items-center justify-center">
            {gallery.images.length > 0 ? (
              <Image 
                src={gallery.images[0].url} 
                alt={gallery.title} 
                width={224} 
                height={224} 
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <Eye size={48} style={{ color: 'var(--color-textSecondary)' }} />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-end text-center md:text-left">
            <p className="text-sm font-bold uppercase" style={{ color: 'var(--color-textPrimary)' }}>Gallery</p>
            <h1 className="text-4xl md:text-6xl font-extrabold my-2 leading-tight" style={{ color: 'var(--color-textPrimary)', textShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}>
              {gallery.title}
            </h1>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm mt-4" style={{ color: 'var(--color-textSecondary)' }}>
              <div className="flex items-center space-x-2">
                <Image src={gallery.author.avatar || '/default-avatar.png'} alt={gallery.author.name} width={24} height={24} className="rounded-full" />
                <span className="font-semibold" style={{ color: 'var(--color-textPrimary)' }}>{gallery.author.name}</span>
              </div>
              <span className="mx-1">·</span>
              <span>Created {formatDate(gallery.createdAt)}</span>
              <span className="mx-1">·</span>
              <span>{gallery.viewCount} views</span>
            </div>
          </div>
        </div>
        <StatusBadge status={gallery.status} />
      </header>

      {/* Main Content Area */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
             <button onClick={() => router.back()} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-textPrimary)', border: '1px solid var(--color-border)' }}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button onClick={handleDeleteClick} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <Trash2 size={16} />
              <span>Delete Gallery</span>
            </button>
          </div>
          
          {gallery.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Description</h2>
              <p className="text-base" style={{ color: 'var(--color-textSecondary)', whiteSpace: 'pre-wrap' }}>
                {gallery.description}
              </p>
            </div>
          )}
          
        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.images.map((image, index) => (
            <button key={image.id} onClick={() => openLightbox(index)} className="group relative overflow-hidden rounded-lg aspect-square block w-full">
              <Image
                src={image.url}
                alt={image.alt}
                layout="fill"
                className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-sm line-clamp-2">{image.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && gallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeLightbox}>
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white z-50">
              <XCircle size={32} />
            </button>

            {/* Previous Button */}
            <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/50 hover:text-white z-50 transition-colors">
              <ChevronLeft size={32} />
            </button>

            {/* Image and Caption */}
            <div className="flex flex-col items-center justify-center max-w-5xl w-full max-h-[90vh] p-4">
              <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden">
                <Image
                  key={gallery.images[currentImageIndex].id}
                  src={gallery.images[currentImageIndex].url}
                  alt={gallery.images[currentImageIndex].alt}
                  width={1600}
                  height={900}
                  className="object-contain max-w-full max-h-full rounded-lg transition-opacity duration-300"
                />
              </div>
              {gallery.images[currentImageIndex].caption && (
                <p className="flex-shrink-0 mt-4 text-white/90 text-center max-w-3xl">
                  {gallery.images[currentImageIndex].caption}
                </p>
              )}
            </div>

            {/* Next Button */}
            <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/50 hover:text-white z-50 transition-colors">
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-lg shadow-xl" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>Delete Gallery</h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Are you sure you want to delete this gallery? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--color-textPrimary)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}