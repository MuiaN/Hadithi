'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  Upload, 
  FileText, 
  BookOpen, 
  Newspaper,
  X,
  Plus
} from 'lucide-react';
import { contentApi } from '@/lib/api/contentApi';
import useStore from '@/lib/store/useStore';
import Image from 'next/image';

export default function NewContentPage() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'story',
    description: '',
    content: '',
    tags: [] as string[],
    coverImage: '',
    isFree: true,
    subscriptionTier: null,
    audioUrl: '',
    duration: ''
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
      await contentApi.createContent({
        ...formData,
        author: user?.name || 'Unknown',
        authorId: user?.id || '0'
      });

      router.push('/creator');
    } catch (error) {
      console.error('Error creating content:', error);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story':
        return <FileText size={20} />;
      case 'book':
        return <BookOpen size={20} />;
      case 'article':
        return <Newspaper size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            Create New Content
          </h1>
          <p style={{ color: 'var(--color-textSecondary)' }}>
            Share your story with the Hadithi community
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
                  Content Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['story', 'article', 'book'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-colors ${
                        formData.type === type ? 'shadow-md' : ''
                      }`}
                      style={{
                        backgroundColor: formData.type === type ? 'var(--color-primary)10' : 'var(--color-backgroundSecondary)',
                        borderColor: formData.type === type ? 'var(--color-primary)' : 'var(--color-border)',
                        color: 'var(--color-textPrimary)'
                      }}
                    >
                      {getTypeIcon(type)}
                      <span className="font-medium capitalize">{type}</span>
                    </button>
                  ))}
                </div>
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
          </div>

          {/* Content */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Content
            </h2>

            <div className="space-y-6">
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
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Content
                </label>
                <textarea
                  name="content"
                  required
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    borderColor: 'var(--color-inputBorder)',
                    color: 'var(--color-textPrimary)'
                  }}
                  placeholder="Write your content here..."
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
                <span>{saving ? 'Saving...' : 'Save Draft'}</span>
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
    </div>
  );
}