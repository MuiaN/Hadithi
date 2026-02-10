'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Upload, 
  FileText, 
  X,
  ListOrdered,
  Plus,
  Send,
  Image as ImageIcon,
  Link2
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { upload } from '@vercel/blob/client';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Dynamically import a rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

export default function NewStoryPage() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'story',
    description: '',
    content: '',
    tags: [] as string[],
    coverImage: '',
    isFree: true,
    subscriptionTier: null,
    rejectionReason: null,
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
  const [preview, setPreview] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [galleriesList, setGalleriesList] = useState<{ id: string; title: string }[]>([]);
  const [podcastsList, setPodcastsList] = useState<{ id: string; title: string }[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [tagInputFocused, setTagInputFocused] = useState(false);

  const { user } = useStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent, status: 'DRAFT' | 'PENDING_APPROVAL' = 'DRAFT') => {
    e.preventDefault();
    setSaving(true);

    if (formData.seriesId && (formData.chapterNumber === null || formData.chapterNumber === undefined)) {
      toast({ title: 'Error', description: 'Chapter number is required when content is part of a series.', variant: 'destructive' });
      setSaving(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('type', formData.type.toUpperCase());
    data.append('status', status);
    data.append('isFree', String(formData.isFree));
    
    if (formData.subscriptionTier) data.append('subscriptionTier', formData.subscriptionTier);
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
      const res = await fetch('/api/v1/creator/content', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error('Failed to create content');
      router.push('/creator');
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [seriesRes, galleriesRes, podcastsRes, tagsRes] = await Promise.all([
          fetch('/api/v1/creator/series'),
          fetch('/api/v1/creator/galleries'),
          fetch('/api/v1/creator/content?type=PODCAST'),
          fetch('/api/v1/creator/tags'),
        ]);

        if (seriesRes.ok) setSeriesList(await seriesRes.json());
        if (galleriesRes.ok) setGalleriesList(await galleriesRes.json());
        if (podcastsRes.ok) setPodcastsList(await podcastsRes.json());
        if (tagsRes.ok) setExistingTags(await tagsRes.json());

      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateSeries = async () => {
    if (!newSeriesTitle.trim()) {
      toast({ title: 'Error', description: 'Series title cannot be empty.', variant: 'destructive' });
      return;
    }
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
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const addExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            Create New Story
          </h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>
            Share your story with the Hadithi community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                  placeholder="Enter a compelling title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                  placeholder="Provide a brief description..."
                />
              </div>
            </div>

            {/* Series Information */}
            <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
                Series Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Part of a Series?
                  </label>
                  <select
                    name="seriesId"
                    value={formData.seriesId || ''}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setShowNewSeriesInput(true);
                        setFormData(prev => ({ ...prev, seriesId: null, chapterNumber: null }));
                      } else {
                        setShowNewSeriesInput(false);
                        handleChange(e);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  >
                    <option value="">No Series</option>
                    {seriesList.map(series => (
                      <option key={series.id} value={series.id}>{series.title}</option>
                    ))}
                    <option value="new">-- Create New Series --</option>
                  </select>
                  {showNewSeriesInput && (
                    <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                      <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-textPrimary)' }}>Create New Series</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Series Title</label>
                          <input
                            type="text"
                            value={newSeriesTitle}
                            onChange={(e) => setNewSeriesTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{
                              backgroundColor: 'var(--color-input)',
                              borderColor: 'var(--color-inputBorder)',
                              color: 'var(--color-textPrimary)'
                            }}
                            placeholder="e.g., The Hadithi Chronicles"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>Series Description (Optional)</label>
                          <textarea
                            value={newSeriesDescription}
                            onChange={(e) => setNewSeriesDescription(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{
                              backgroundColor: 'var(--color-input)',
                              borderColor: 'var(--color-inputBorder)',
                              color: 'var(--color-textPrimary)'
                            }}
                            placeholder="A brief overview of the series..."
                          />
                        </div>
                        <button type="button" onClick={handleCreateSeries} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Create Series</button>
                      </div>
                    </div>
                  )}
                </div>

                {formData.seriesId && formData.seriesId !== 'new' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Chapter Number
                    </label>
                    <div className="relative">
                      <ListOrdered className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textSecondary)' }} />
                      <input
                        type="number"
                        name="chapterNumber"
                        value={formData.chapterNumber || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, chapterNumber: parseInt(e.target.value) || null }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                        placeholder="e.g., 1, 2, 3..."
                        min="1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Content
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="cover-image-upload" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Upload Cover Image
                </label>
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
                  <label
                    htmlFor="cover-image-upload"
                    className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span>
                      {coverImagePreview || formData.coverImage ? 'Change' : 'Add Image'}
                    </span>
                    <input id="cover-image-upload" name="cover-image" type="file" className="sr-only" accept="image/*" onChange={handleCoverImageChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Content
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                />
              </div>
            </div>
          </div>

          {/* Tags and Settings */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Tags & Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Tags
                </label>
                <div className="relative">
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      onFocus={() => setTagInputFocused(true)}
                      onBlur={() => setTimeout(() => setTagInputFocused(false), 150)}
                      className="flex-1 px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {tagInputFocused && (
                    <div className="absolute z-10 w-full max-h-48 overflow-y-auto p-2 rounded-lg border mt-1" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                      <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2 px-1">Available Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {existingTags
                          .filter(tag => !formData.tags.includes(tag))
                          .filter(tag => tag.toLowerCase().includes(newTag.toLowerCase()))
                          .map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onMouseDown={() => addExistingTag(tag)}
                              className="px-3 py-1 text-sm rounded-full transition-colors"
                              style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)', border: '1px solid var(--color-border)' }}
                            >
                              {tag}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                      Free Content
                    </span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Subscription Tier Required
                    </label>
                    <select
                      name="subscriptionTier"
                      value={formData.subscriptionTier || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    >
                      <option value="">Select tier</option>
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                    </select>
                  </div>
                )}
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
                <select
                  id="galleryId"
                  name="galleryId"
                  value={formData.galleryId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                >
                  <option value="">None</option>
                  {galleriesList.map(gallery => (
                    <option key={gallery.id} value={gallery.id}>{gallery.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="linkedPodcastId" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Link to a Podcast
                </label>
                <select
                  id="linkedPodcastId"
                  name="linkedPodcastId"
                  value={formData.linkedPodcastId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                >
                  <option value="">None</option>
                  {podcastsList.map(podcast => (
                    <option key={podcast.id} value={podcast.id}>{podcast.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--color-textSecondary)' }}>
              You can link this content to one of your existing galleries or podcasts.
              This is useful for creating rich, interconnected experiences for your readers.
              You can create new galleries and podcasts from their respective pages in the creator dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/creator')}
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
            >
              Cancel
            </button>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'DRAFT')}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-textPrimary)' }}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'PENDING_APPROVAL')}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <Send size={16} />
                <span>{saving ? 'Submitting...' : 'Submit for Review'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Preview Modal */}
        {preview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg" style={{ backgroundColor: 'var(--color-card)' }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                    Preview
                  </h2>
                  <button
                    onClick={() => setPreview(false)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--color-textSecondary)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.coverImage && (
                    <Image
                      src={formData.coverImage}
                      alt={formData.title}
                      className="w-full h-64 object-cover rounded-lg"
                      width={400}
                      height={300}
                    />
                  )}

                  <div>
                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                      {formData.title || 'Untitled'}
                    </h1>
                    <p className="text-lg mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                      {formData.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textSecondary)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prose max-w-none" style={{ color: 'var(--color-textPrimary)' }}>
                    {formData.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}