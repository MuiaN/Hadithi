'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Upload, 
  Music,
  X,
  Plus,
  Send,
  Image as ImageIcon,
  ListOrdered
} from 'lucide-react';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import dynamic from 'next/dynamic';
import { upload } from '@vercel/blob/client';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

interface PodcastFormData {
  title: string;
  description: string;
  content: string;
  tags: string[];
  coverImage: string;
  duration: string;
  isFree: boolean;
  subscriptionTier: string;
  seriesId: string | null;
  chapterNumber: number | null;
}

export default function CreatePodcastPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [] as string[],
    coverImage: '', // This will be handled by coverImageFile
    duration: '',
    isFree: true,
    subscriptionTier: null as string | null,
    seriesId: null,
    chapterNumber: null as number | null,
  });
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [seriesList, setSeriesList] = useState<{ id: string; title: string }[]>([]);
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [newSeriesDescription, setNewSeriesDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent, status: 'DRAFT' | 'PENDING_APPROVAL' = 'DRAFT') => {
    e.preventDefault();
    if (formData.seriesId && (formData.chapterNumber === null || formData.chapterNumber === undefined)) {
      alert('Chapter number is required when content is part of a series.');
      setSaving(false);
      return;
    }
    setSaving(true);
  
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('type', 'PODCAST');
    data.append('status', status);
    data.append('isFree', String(formData.isFree));
    if (formData.subscriptionTier) data.append('subscriptionTier', formData.subscriptionTier);
    if (formData.seriesId) data.append('seriesId', formData.seriesId);
    if (formData.chapterNumber) data.append('chapterNumber', String(formData.chapterNumber));
    if (formData.duration) data.append('duration', formData.duration);
    
    formData.tags.forEach(tag => data.append('tags', tag));

    // Upload files client-side if they exist
    if (coverImageFile) {
      const coverImageName = `media/images/${Date.now()}-${coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const blob = await upload(coverImageName, coverImageFile, {
        access: 'public',
        handleUploadUrl: '/api/v1/creator/upload',
      });
      data.append('coverImage', blob.url);
    }

    if (audioFile) {
      const audioFileName = `media/podcasts/${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const blob = await upload(audioFileName, audioFile, {
        access: 'public',
        handleUploadUrl: '/api/v1/creator/upload',
      });
      data.append('audioFile', blob.url);
    } else if (status === 'PENDING_APPROVAL') {
        alert('An audio file is required to submit a podcast for review.');
        setSaving(false);
        return;
    }
  
    try {
      const res = await fetch('/api/v1/creator/content', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error('Failed to create podcast'); // Changed from 'content'
      router.push('/creator');
    } catch (error) {
      console.error('Error creating podcast:', error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesRes, tagsRes] = await Promise.all([
          fetch('/api/v1/creator/series'),
          fetch('/api/v1/creator/tags'),
        ]);

        if (seriesRes.ok) setSeriesList(await seriesRes.json());
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

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const audioURL = URL.createObjectURL(file); // Create URL once
      setAudioPreviewUrl(audioURL); // Store it in state
      if (audioRef.current) {
        audioRef.current.src = audioURL;
        audioRef.current.onloadedmetadata = () => {
          const minutes = Math.floor(audioRef.current!.duration / 60);
          const seconds = Math.floor(audioRef.current!.duration % 60);
          setFormData(prev => ({ ...prev, duration: `${minutes}:${seconds.toString().padStart(2, '0')}` }));
        };
      }
    }
  };

  const handleCreateSeries = async () => {
    if (!newSeriesTitle.trim()) {
      alert('Series title cannot be empty.');
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

  const addExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>Create New Podcast</h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>Upload your podcast episode details and audio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="Episode Title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="A brief summary of the episode..." />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6">Media</h2>
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <div className="mt-2 flex items-center gap-x-3">
                  {coverImagePreview ? <Image src={coverImagePreview} alt="Cover preview" width={48} height={48} className="h-12 w-12 rounded-md object-cover" /> : <ImageIcon className="h-12 w-12 text-gray-300" />}
                  <label htmlFor="cover-image-upload" className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)', borderColor: 'var(--color-border)' }}>
                    <span>{coverImagePreview ? 'Change' : 'Add Image'}</span>
                    <input id="cover-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleCoverImageChange} />
                  </label>
                </div>
              </div>
              {/* Audio File */}
              <div>
                <label className="block text-sm font-medium mb-2">Audio File</label>
                <div className="mt-2 flex items-center gap-x-3">
                  <audio ref={audioRef} src={audioPreviewUrl} controls className="w-full max-w-md" />
                  <label htmlFor="audio-file-upload" className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)', borderColor: 'var(--color-border)' }}>
                    <span>{audioFile ? 'Change Audio' : 'Add Audio'}</span>
                    <input id="audio-file-upload" type="file" className="sr-only" accept="audio/mpeg,audio/wav,audio/ogg" onChange={handleAudioFileChange} />
                  </label>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-textSecondary)' }}>Duration: {formData.duration || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Show Notes */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6">Show Notes</h2>
            <RichTextEditor value={formData.content} onChange={(value) => setFormData(prev => ({ ...prev, content: value }))} />
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
                {/* Monetization */}
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
                      Subscription Tier
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

          {/* Series Information */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6">Series Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Part of a Series?</label>
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
                  style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                >
                  <option value="">No Series</option>
                  {seriesList.map(series => (
                    <option key={series.id} value={series.id}>{series.title}</option>
                  ))}
                  <option value="new">-- Create New Series --</option>
                </select>
                {showNewSeriesInput && (
                  <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                    <h3 className="text-lg font-medium mb-3">Create New Series</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Series Title</label>
                        <input type="text" value={newSeriesTitle} onChange={(e) => setNewSeriesTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="e.g., The Hadithi Chronicles" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Series Description (Optional)</label>
                        <textarea value={newSeriesDescription} onChange={(e) => setNewSeriesDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="A brief overview of the series..." />
                      </div>
                      <button type="button" onClick={handleCreateSeries} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Create Series</button>
                    </div>
                  </div>
                )}
              </div>

              {formData.seriesId && formData.seriesId !== 'new' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Chapter Number</label>
                  <div className="relative">
                    <ListOrdered className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textSecondary)' }} />
                    <input
                      type="number"
                      name="chapterNumber"
                      value={formData.chapterNumber || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, chapterNumber: parseInt(e.target.value) || null }))}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border"
                      style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                      placeholder="e.g., 1, 2, 3..."
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
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
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
      </div>
    </div>
  );
}