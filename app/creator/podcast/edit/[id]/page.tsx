'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Upload, 
  X,
  Plus,
  Send,
  Image as ImageIcon,
  Trash2,
  Music,
  ListOrdered,
  Link2
} from 'lucide-react';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

interface FormDataState {
  title: string;
  description: string;
  content: string; // Show Notes
  tags: string[];
  coverImage: string;
  isFree: boolean;
  subscriptionTier: string | null;
  duration: string;
  audioFile: string | null;
  seriesId: string | null;
  chapterNumber: number | null;
}

export default function EditPodcastPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const cleanId = id.replace(/\/$/, '');

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    content: '',
    tags: [],
    coverImage: '',
    isFree: true,
    subscriptionTier: null,
    duration: '',
    audioFile: null,
    seriesId: null,
    chapterNumber: null,
  });

  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [seriesList, setSeriesList] = useState<{ id: string; title: string }[]>([]);
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [newSeriesDescription, setNewSeriesDescription] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [res, seriesRes] = await Promise.all([
          fetch(`/api/v1/creator/content/${cleanId}`),
          fetch('/api/v1/creator/series'),
        ]);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch podcast data');
        }
        
        const podcastData = await res.json();
        if (podcastData.type !== 'PODCAST') {
          throw new Error('This content is not a podcast.');
        }

        setFormData({
          ...podcastData,
          tags: podcastData.tags.map((t: { name: string }) => t.name),
        });

        if (podcastData.coverImage) setCoverImagePreview(podcastData.coverImage);

        if (seriesRes.ok) setSeriesList(await seriesRes.json());

      } catch (error) {
        console.error('Error fetching podcast data:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cleanId]);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent, status?: 'DRAFT' | 'PENDING_APPROVAL') => {
    e.preventDefault();

    if (formData.seriesId && (formData.chapterNumber === null || formData.chapterNumber === undefined)) {
      alert('Chapter number is required when content is part of a series.');
      return;
    }

    setSaving(true);

    let coverImageAsDataUrl: string | undefined = undefined;
    if (coverImageFile) {
      coverImageAsDataUrl = await fileToDataUrl(coverImageFile);
    }

    let audioFileAsDataUrl: string | undefined = undefined;
    if (audioFile) {
      audioFileAsDataUrl = await fileToDataUrl(audioFile);
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      isFree: formData.isFree,
      subscriptionTier: formData.subscriptionTier ? formData.subscriptionTier.toUpperCase() : null,
      tags: formData.tags,
      duration: formData.duration,
      seriesId: formData.seriesId,
      chapterNumber: formData.chapterNumber,
      ...(coverImageAsDataUrl && { coverImage: coverImageAsDataUrl }),
      ...(audioFileAsDataUrl && { audioFile: audioFileAsDataUrl }),
      ...(status && { status }),
    };

    try {
      const res = await fetch(`/api/v1/creator/content/${cleanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update podcast');
      }
      router.push('/creator');
    } catch (error) {
      console.error('Error updating podcast:', error);
      setError((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to archive this podcast?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/creator/content/${cleanId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to archive podcast');
      router.push('/creator');
    } catch (error) {
      console.error('Error archiving podcast:', error);
    } finally {
      setSaving(false);
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

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const audioURL = URL.createObjectURL(file);
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

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>Edit Podcast</h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>Update your podcast episode details and audio.</p>
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
                  <audio ref={audioRef} src={audioFile ? URL.createObjectURL(audioFile) : formData.audioFile || ''} controls className="w-full max-w-md" />
                  <label htmlFor="audio-file-upload" className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)', borderColor: 'var(--color-border)' }}>
                    <span>Change Audio</span>
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
            <h2 className="text-xl font-semibold mb-6">Tags & Settings</h2>
            <div className="space-y-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex space-x-2 mb-3">
                  <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }} placeholder="Add a tag..." />
                  <button type="button" onClick={addTag} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}>
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Monetization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="rounded" />
                    <span className="text-sm">Free Content</span>
                  </label>
                </div>
                {!formData.isFree && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Subscription Tier</label>
                    <select name="subscriptionTier" value={formData.subscriptionTier || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}>
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
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}>Cancel</button>
            <div className="flex items-center space-x-4">
              <button type="button" onClick={handleDelete} disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors text-red-500 hover:bg-red-500/10 disabled:opacity-50"><Trash2 size={16} /><span>Archive</span></button>
              <button type="button" onClick={(e) => handleSubmit(e, 'DRAFT')} disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-textPrimary)' }}><Save size={16} /><span>{saving ? 'Saving...' : 'Save Changes'}</span></button>
              <button type="button" onClick={(e) => handleSubmit(e, 'PENDING_APPROVAL')} disabled={saving} className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}><Send size={16} /><span>{saving ? 'Submitting...' : 'Submit for Review'}</span></button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}