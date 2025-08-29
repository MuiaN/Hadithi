'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  Upload, 
  Headphones, 
  Music,
  X,
  Plus,
  Clock,
  Mic
} from 'lucide-react';
import Image from 'next/image';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';

interface PodcastFormData {
  title: string;
  description: string;
  content: string;
  tags: string[];
  coverImage: string;
  audioUrl: string;
  duration: string;
  isFree: boolean;
  subscriptionTier: string;
}

export default function CreatePodcastPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [] as string[],
    coverImage: '',
    audioUrl: '',
    duration: '',
    isFree: true,
    subscriptionTier: null
  });
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const { user } = useStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await contentApi.createPodcast({
        ...formData,
        author: user?.name || 'Unknown',
        authorId: user?.id || '0'
      });

      router.push('/creator');
    } catch (error) {
      console.error('Error creating podcast:', error);
    } finally {
      setSaving(false);
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Headphones className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                Create New Podcast
              </h1>
              <p style={{ color: 'var(--color-textSecondary)' }}>
                Share your audio stories with the Hadithi community
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: 'var(--color-textPrimary)' }}>
              <Mic size={20} />
              <span>Podcast Details</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Podcast Title
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
                  placeholder="Enter a compelling podcast title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                  placeholder="Describe what your podcast is about..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Duration
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textSecondary)' }} />
                    <input
                      type="text"
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                      placeholder="e.g., 45:32"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Audio Content */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: 'var(--color-textPrimary)' }}>
              <Music size={20} />
              <span>Audio Content</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Audio File URL
                </label>
                <input
                  type="url"
                  name="audioUrl"
                  required
                  value={formData.audioUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                  placeholder="https://example.com/audio.mp3"
                />
                <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>
                  Upload your audio file to a hosting service and paste the URL here
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Episode Notes / Transcript
                </label>
                <textarea
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                  placeholder="Add episode notes, key points, or transcript..."
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
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
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
                <div className="flex flex-wrap gap-2">
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
                      Free Podcast
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
                onClick={() => setPreview(!preview)}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
              >
                <Eye size={16} />
                <span>{preview ? 'Edit' : 'Preview'}</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <Save size={16} />
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
                    Podcast Preview
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
                  <div className="flex items-start space-x-6">
                    {formData.coverImage && (
                      <Image
                        src={formData.coverImage}
                        alt={formData.title}
                        className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
                        width={192}
                        height={192}
                      />
                    )}
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
                        {formData.title || 'Untitled Podcast'}
                      </h1>
                      <p className="text-lg mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                        {formData.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="flex items-center space-x-1 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          <Clock size={14} />
                          <span>{formData.duration || 'Duration not set'}</span>
                        </span>
                        <span className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                          By {user?.name}
                        </span>
                      </div>
                      
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

                      {formData.audioUrl && (
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                          <p className="text-sm mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                            Audio Preview:
                          </p>
                          <audio controls className="w-full">
                            <source src={formData.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.content && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-textPrimary)' }}>
                        Episode Notes
                      </h3>
                      <div className="prose max-w-none" style={{ color: 'var(--color-textPrimary)' }}>
                        {formData.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}