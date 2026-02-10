'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Upload, 
  X,
  ListOrdered,
  Plus,
  Send,
  Image as ImageIcon,
  Link2,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { upload } from '@vercel/blob/client';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

export default function EditBookPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const cleanId = id.replace(/\/$/, '');

  interface FormDataState {
    title: string;
    type: string;
    description: string;
    content: string;
    tags: string[];
    coverImage: string;
    isFree: boolean;
    subscriptionTier: string | null;
    seriesId: string | null;
    chapterNumber: number | null;
    galleryId: string | null;
    linkedPodcastId: string | null;
  }

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    type: 'book',
    description: '',
    content: '',
    tags: [] as string[],
    coverImage: '',
    isFree: false,
    subscriptionTier: null,
    seriesId: null,
    chapterNumber: null as number | null,
    galleryId: null,
    linkedPodcastId: null,
  });
  const [newTag, setNewTag] = useState('');
  const [seriesList, setSeriesList] = useState<{ id: string; title: string }[]>([]);
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [newSeriesDescription, setNewSeriesDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [galleriesList, setGalleriesList] = useState<{ id: string; title: string }[]>([]);
  const [podcastsList, setPodcastsList] = useState<{ id: string; title: string }[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [tagInputFocused, setTagInputFocused] = useState(false);

  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [contentRes, seriesRes, galleriesRes, podcastsRes, tagsRes] = await Promise.all([
          fetch(`/api/v1/creator/content/${cleanId}`),
          fetch('/api/v1/creator/series'),
          fetch('/api/v1/creator/galleries'),
          fetch('/api/v1/creator/content?type=PODCAST'),
          fetch('/api/v1/creator/tags'),
        ]);

        if (!contentRes.ok) {
          const errorData = await contentRes.json();
          throw new Error(errorData.message || 'Failed to fetch content');
        }
        
        const contentData = await contentRes.json();
        setFormData({
          ...contentData,
          type: 'book', // Enforce type
          subscriptionTier: contentData.subscriptionTier?.toLowerCase() || null,
          tags: contentData.tags.map((t: { name: string }) => t.name),
        });
        if (contentData.coverImage) setCoverImagePreview(contentData.coverImage);

        if (seriesRes.ok) setSeriesList(await seriesRes.json());
        if (galleriesRes.ok) setGalleriesList(await galleriesRes.json());
        if (podcastsRes.ok) {
          const allPodcasts = await podcastsRes.json();
          setPodcastsList(allPodcasts.filter((p: { id: string }) => p.id !== cleanId));
        }
        if (tagsRes.ok) setExistingTags(await tagsRes.json());

      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cleanId]);

  const handleSubmit = async (e: React.FormEvent, status?: 'DRAFT' | 'PENDING_APPROVAL') => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('type', 'BOOK');
    data.append('isFree', String(formData.isFree));
    
    if (status) data.append('status', status);
    if (formData.subscriptionTier) data.append('subscriptionTier', formData.subscriptionTier.toUpperCase());
    if (formData.seriesId) data.append('seriesId', formData.seriesId);
    if (formData.chapterNumber) data.append('chapterNumber', String(formData.chapterNumber));
    if (formData.galleryId) data.append('galleryId', formData.galleryId);
    if (formData.linkedPodcastId) data.append('linkedPodcastId', formData.linkedPodcastId);
    
    formData.tags.forEach(tag => data.append('tags', tag));

    if (coverImageFile) {
      const coverImageName = `media/images/${Date.now()}-${coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const blob = await upload(coverImageName, coverImageFile, {
        access: 'public',
        handleUploadUrl: '/api/v1/creator/upload',
      });
      data.append('coverImage', blob.url);
    }

    try {
      const res = await fetch(`/api/v1/creator/content/${cleanId}`, {
        method: 'PUT',
        body: data,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update content');
      }
      router.push('/creator/content');
    } catch (error) {
      console.error('Error updating content:', error);
      setError((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/v1/creator/content/${cleanId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete content');
      router.push('/creator/content');
    } catch (error) {
      console.error('Error deleting content:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateSeries = async () => {
    if (!newSeriesTitle.trim()) return;
    try {
      const res = await fetch('/api/v1/creator/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSeriesTitle, description: newSeriesDescription }),
      });
      if (!res.ok) throw new Error('Failed to create series');
      const newSeries = await res.json();
      setSeriesList(prev => [...prev, newSeries]);
      setFormData(prev => ({ ...prev, seriesId: newSeries.id }));
      setShowNewSeriesInput(false);
      setNewSeriesTitle('');
      setNewSeriesDescription('');
    } catch (error) {
      console.error('Error creating series:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const addExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500 p-8">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-center">The page could not be loaded. Please check the console for more details.</p>
        <p className="mt-4 p-4 bg-red-500/10 rounded-md text-sm">
          <strong>Error:</strong> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            Edit Book
          </h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>
            Refine your book and bring it to perfection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="Enter a compelling title..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Description</label>
                <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="Provide a brief description..." />
              </div>
            </div>
            <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>Series Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Part of a Series?</label>
                  <select name="seriesId" value={formData.seriesId || ''} onChange={(e) => { if (e.target.value === 'new') { setShowNewSeriesInput(true); setFormData(prev => ({ ...prev, seriesId: null, chapterNumber: null })); } else { setShowNewSeriesInput(false); handleChange(e); } }} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}>
                    <option value="">No Series</option>
                    {seriesList.map(series => (<option key={series.id} value={series.id}>{series.title}</option>))}
                    <option value="new">-- Create New Series --</option>
                  </select>
                  {showNewSeriesInput && (
                    <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                      <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-textPrimary)' }}>Create New Series</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Series Title</label>
                          <input type="text" value={newSeriesTitle} onChange={(e) => setNewSeriesTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="e.g., The Hadithi Chronicles" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Series Description (Optional)</label>
                          <textarea value={newSeriesDescription} onChange={(e) => setNewSeriesDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="A brief overview of the series..." />
                        </div>
                        <button type="button" onClick={handleCreateSeries} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Create Series</button>
                      </div>
                    </div>
                  )}
                </div>
                {formData.seriesId && formData.seriesId !== 'new' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Chapter Number</label>
                    <div className="relative">
                      <ListOrdered className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textSecondary)' }} />
                      <input type="number" name="chapterNumber" value={formData.chapterNumber || ''} onChange={(e) => setFormData(prev => ({ ...prev, chapterNumber: parseInt(e.target.value) || null }))} className="w-full pl-10 pr-4 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="e.g., 1, 2, 3..." min="1" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>Content</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="cover-image-upload" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Upload Cover Image</label>
                <div className="mt-2 flex items-center gap-x-3">
                  {coverImagePreview || formData.coverImage ? (
                    <Image
                      src={coverImagePreview || formData.coverImage}
                      alt="Cover preview"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                  )}
                  <label htmlFor="cover-image-upload" className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span>{coverImagePreview || formData.coverImage ? 'Change' : 'Add Image'}</span>
                    <input id="cover-image-upload" name="cover-image" type="file" className="sr-only" accept="image/*" onChange={handleCoverImageChange} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Content</label>
                <RichTextEditor value={formData.content} onChange={(value) => setFormData(prev => ({ ...prev, content: value }))} />
              </div>
            </div>
          </div>

          {/* Linking Section */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: 'var(--color-textPrimary)' }}>
              <Link2 size={20} />
              <span>Link Content</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="galleryId" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Attach a Gallery
                </label>
                <select id="galleryId" name="galleryId" value={formData.galleryId || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}>
                  <option value="">None</option>
                  {galleriesList.map(gallery => (<option key={gallery.id} value={gallery.id}>{gallery.title}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="linkedPodcastId" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Link to a Podcast
                </label>
                <select id="linkedPodcastId" name="linkedPodcastId" value={formData.linkedPodcastId || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}>
                  <option value="">None</option>
                  {podcastsList.map(podcast => (<option key={podcast.id} value={podcast.id}>{podcast.title}</option>))}
                </select>
              </div>
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--color-textSecondary)' }}>
              You can link this content to one of your existing galleries or podcasts.
              This is useful for creating rich, interconnected experiences for your readers.
              You can create new galleries and podcasts from their respective pages in the creator dashboard.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => router.push('/creator/content')} className="px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}>Cancel</button>
            <div className="flex items-center space-x-4">
              <button type="button" onClick={handleDeleteClick} disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors text-red-500 hover:bg-red-500/10 disabled:opacity-50"><Trash2 size={16} /><span>Delete</span></button>
              <button type="button" onClick={(e) => handleSubmit(e, 'DRAFT')} disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-textPrimary)' }}><Save size={16} /><span>{saving ? 'Saving...' : 'Save Changes'}</span></button>
              <button type="button" onClick={(e) => handleSubmit(e, 'PENDING_APPROVAL')} disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}><Send size={16} /><span>{saving ? 'Submitting...' : 'Submit for Review'}</span></button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal omitted for brevity, same as generic edit page */}
      <Toaster />
    </div>
  );
}
