'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Eye, Edit, ImageIcon, X, LayoutGrid, List, Search, Filter, CheckCircle, Clock, AlertCircle, XCircle, Save, Send, BarChart2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Image from 'next/image';

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  alt: string;
  fileName?: string; // To store the original file name
  file?: File;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
  status: 'DRAFT' | 'PUBLISHED' | 'PENDING_APPROVAL' | 'REJECTED' | 'ARCHIVED';
  isPublished: boolean;
  isFree: boolean;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  tags: string[];
  viewCount: number;
  subscriptionTier: 'BRONZE' | 'SILVER' | 'GOLD' | null;
}

export default function CreatorGalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as GalleryImage[],
    tags: [] as string[],
    status: 'DRAFT',
    isFree: true,
    subscriptionTier: null as 'BRONZE' | 'SILVER' | 'GOLD' | null,
  });

  const [newImage, setNewImage] = useState({
    url: '',
    caption: '',
    alt: '',
  });

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const [galleriesRes, tagsRes] = await Promise.all([
          fetch('/api/v1/creator/galleries'),
          fetch('/api/v1/creator/tags'),
        ]);
        if (!galleriesRes.ok) throw new Error('Failed to fetch galleries');
        const data = await galleriesRes.json();
        setGalleries(data);
        setFilteredGalleries(data);
        if (tagsRes.ok) setExistingTags(await tagsRes.json());
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Could not load your galleries.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  useEffect(() => {
    let filtered = galleries;

    if (searchTerm) {
      filtered = filtered.filter((gallery) =>
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((gallery) => gallery.status === statusFilter);
    }

    setFilteredGalleries(filtered);
  }, [galleries, searchTerm, statusFilter]);

  const handleSubmit = async (e: React.FormEvent, status: 'DRAFT' | 'PENDING_APPROVAL' = 'DRAFT') => {
    e.preventDefault();

    const galleryData = {
      title: formData.title,
      description: formData.description,
      images: formData.images,
      tags: formData.tags,
      status: status,
      isFree: formData.isFree,
      subscriptionTier: formData.isFree ? null : formData.subscriptionTier,
    };

    try {
      let response;
      if (editingGallery) {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('status', status);
        data.append('isFree', String(formData.isFree));
        if (formData.subscriptionTier) data.append('subscriptionTier', formData.subscriptionTier);
        formData.tags.forEach(tag => data.append('tags', tag));

        // Prepare metadata for all images (both existing and new)
        const imagesMetadata = formData.images.map(img => ({
          url: img.url,
          caption: img.caption || '',
          alt: img.alt || '',
          isNew: !!img.file // Flag to tell backend this is a new file
        }));
        data.append('imagesMetadata', JSON.stringify(imagesMetadata));

        // Append new files
        formData.images.forEach(img => {
          if (img.file) {
            data.append('newImages', img.file);
          }
        });

        response = await fetch(`/api/v1/creator/galleries/${editingGallery.id}`, {
          method: 'PUT',
          body: data,
        });
      } else {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('status', status);
        data.append('isFree', String(formData.isFree));
        if (formData.subscriptionTier) data.append('subscriptionTier', formData.subscriptionTier);
        
        formData.tags.forEach(tag => data.append('tags', tag));

        formData.images.forEach((img) => {
          if (img.file) {
            data.append('images', img.file);
            data.append('captions', img.caption || '');
            data.append('alts', img.alt || '');
          }
        });

        response = await fetch('/api/v1/creator/galleries', {
          method: 'POST',
          body: data,
        });
      }

      if (!response.ok) throw new Error(`Failed to ${editingGallery ? 'update' : 'create'} gallery`);

      const savedGallery = await response.json();

      if (editingGallery) {
        setGalleries(galleries.map(g => g.id === savedGallery.id ? savedGallery : g));
      } else {
        setGalleries([savedGallery, ...galleries]);
      }

      toast({
        title: 'Success',
        description: `Gallery ${editingGallery ? 'updated' : 'created'} successfully`,
      });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingGallery ? 'update' : 'create'} gallery`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      const response = await fetch(`/api/v1/creator/galleries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete gallery');
      setGalleries(galleries.filter(g => g.id !== id));
      toast({
        title: 'Success',
        description: 'Gallery deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete gallery',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      images: gallery.images,
      tags: gallery.tags,
      status: gallery.status as any,
      isFree: gallery.isFree ?? true,
      subscriptionTier: gallery.subscriptionTier,
    });
    setIsDialogOpen(true);
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

  const addExistingTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const addImageToGallery = () => {
    // This is a placeholder for actual file upload logic.
    // In a real app, you would upload the file to a service (like S3, Cloudinary)
    // and get a URL back. Here, we'll use a data URL for local preview.
    const file = (fileInputRef.current?.files || [])[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setFormData({
          ...formData,
          images: [
            ...formData.images,
            { ...newImage, url, id: crypto.randomUUID(), fileName: file.name, file: file }
          ],
        });
        setNewImage({ url: '', caption: '', alt: '' });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      };
      reader.readAsDataURL(file);
    } else {
       toast({
        title: 'Error',
        description: 'Please select an image file to upload.',
        variant: 'destructive',
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      images: [],
      tags: [] as string[],
      status: 'DRAFT',
      isFree: true,
      subscriptionTier: null,
    });
    setNewImage({ url: '', caption: '', alt: '' });
    setEditingGallery(null);
    setNewTag('');
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'text-green-600 bg-green-100';
      case 'DRAFT': return 'text-yellow-600 bg-yellow-100';
      case 'PENDING_APPROVAL': return 'text-blue-600 bg-blue-100';
      case 'ARCHIVED': return 'text-red-600 bg-red-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
            <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>Loading galleries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            My Galleries
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Create and manage your image galleries
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex flex-1 gap-4 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: 'var(--color-textTertiary)' }} />
              <input
                type="text"
                placeholder="Search galleries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: 'var(--color-inputBorder)',
                  color: 'var(--color-textPrimary)'
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={16} style={{ color: 'var(--color-textSecondary)' }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: 'var(--color-inputBorder)',
                  color: 'var(--color-textPrimary)'
                }}
              >
                <option value="all">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="PENDING_APPROVAL">In Review</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
            <div className="flex items-center bg-[var(--color-input)] rounded-lg border border-[var(--color-inputBorder)] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-textSecondary)] hover:bg-[var(--color-backgroundSecondary)]'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-textSecondary)] hover:bg-[var(--color-backgroundSecondary)]'}`}
              >
                <List size={20} />
              </button>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} style={{ backgroundColor: 'var(--color-primary)' }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Gallery
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose(); else setIsDialogOpen(true); }}>
            {/* This DialogTrigger is now handled by the onClick of the button below */}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-card)' }}>
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--color-textPrimary)' }}>
                  {editingGallery ? 'Edit Gallery' : 'Create New Gallery'}
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title" style={{ color: 'var(--color-textPrimary)' }}>Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="description" style={{ color: 'var(--color-textPrimary)' }}>Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="tags" style={{ color: 'var(--color-textPrimary)' }}>Tags</Label>
                  <div className="relative">
                    <div className="flex space-x-2 mb-3">
                      <Input
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        onFocus={() => setTagInputFocused(true)}
                        onBlur={() => setTimeout(() => setTagInputFocused(false), 150)}
                        placeholder="Add a tag..."
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                      >
                        <Plus size={16} />
                      </Button>
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                      >
                        <span>{tag}</span>
                        <Button type="button" variant="ghost" size="sm" className="h-auto p-0.5 -mr-1 hover:text-red-500" onClick={() => removeTag(tag)}>
                          <X size={12} />
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm" style={{ color: 'var(--color-textPrimary)' }}>
                        Free Gallery
                      </span>
                    </Label>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <Label htmlFor="subscriptionTier" style={{ color: 'var(--color-textPrimary)' }}>Subscription Tier Required</Label>
                      <select
                        id="subscriptionTier"
                        name="subscriptionTier"
                        value={formData.subscriptionTier || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, subscriptionTier: e.target.value as any }))}
                        className="w-full mt-1 px-3 py-2 rounded-lg border"
                        style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)', color: 'var(--color-textPrimary)' }}
                      >
                        <option value="">Select tier</option>
                        <option value="BRONZE">Bronze</option>
                        <option value="SILVER">Silver</option>
                        <option value="GOLD">Gold</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Images</h3>
                  <div className="space-y-3 mb-4">
                    <div className="p-4 border-2 border-dashed rounded-lg text-center" style={{ borderColor: 'var(--color-border)' }}>
                      <Label htmlFor="image-upload" className="cursor-pointer" style={{ color: 'var(--color-textPrimary)' }}>
                        <ImageIcon className="mx-auto mb-2" size={24} />
                        Click to upload an image
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-caption" style={{ color: 'var(--color-textPrimary)' }}>Caption (Optional)</Label>
                      <Input
                        id="image-caption"
                        value={newImage.caption}
                        onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                        placeholder="Image caption"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-alt" style={{ color: 'var(--color-textPrimary)' }}>Alt Text (for accessibility)</Label>
                      <Input
                        id="image-alt"
                        value={newImage.alt}
                        onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                        placeholder="Description for accessibility"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    </div>
                    <Button type="button" onClick={addImageToGallery} variant="outline" size="sm" className="w-full justify-center">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium pt-4 border-t" style={{ color: 'var(--color-textPrimary)', borderColor: 'var(--color-border)' }}>
                        Added Images ({formData.images.length})
                      </h4>
                      <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                        {formData.images.map((img, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 p-2 border rounded"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            <Image 
                              src={img.url} 
                              alt={img.alt} 
                              className="w-16 h-16 object-cover rounded"
                              width={64}
                              height={64}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-textPrimary)' }}>
                                {img.caption || 'No caption'}
                              </p>
                              <p className="text-xs truncate" style={{ color: 'var(--color-textSecondary)' }}>
                                {img.fileName || img.url.split('/').pop()}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={(e) => handleSubmit(e, 'DRAFT')} style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-textPrimary)' }}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button type="button" onClick={(e) => handleSubmit(e, 'PENDING_APPROVAL')} style={{ backgroundColor: 'var(--color-primary)' }}>
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <p style={{ color: 'var(--color-textSecondary)' }}>
            {filteredGalleries.length} {filteredGalleries.length === 1 ? 'gallery' : 'galleries'} found
          </p>
        </div>

        {filteredGalleries.length === 0 ? (
          <Card style={{ backgroundColor: 'var(--color-card)' }}>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <ImageIcon size={32} style={{ color: 'var(--color-textTertiary)' }} />
              </div>
              <p className="text-lg mb-2" style={{ color: 'var(--color-textSecondary)' }}>
                {galleries.length === 0 ? 'No galleries yet' : 'No galleries found'}
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--color-textSecondary)' }}>
                {galleries.length === 0 
                  ? 'Create your first gallery to get started.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {galleries.length === 0 ? 'Create Your First Gallery' : 'Create Gallery'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => {
              const status = gallery.status || 'DRAFT';
              const statusText = status.replace('_', ' ').toLowerCase();
              const statusColor = getStatusColor(status);

              return (
                <div key={gallery.id} className="card overflow-hidden" style={{ backgroundColor: 'var(--color-card)' }}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={gallery.images.length > 0 ? gallery.images[0].url : '/images/placeholder.png'}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                      layout="fill"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleDelete(gallery.id)}
                        className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-red-500/50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                      {gallery.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                      {gallery.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                      <span>Created {formatDate(gallery.createdAt)}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{formatNumber(gallery.viewCount)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/creator/galleries/${gallery.id}`}
                        className="col-span-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </Link>
                      <Button
                        onClick={() => handleEdit(gallery)}
                        size="sm"
                        className="col-span-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Link
                        href={`/creator/analytics/${gallery.id}`}
                        className="col-span-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                        style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                      >
                        <BarChart2 size={14} />
                        <span className="hidden sm:inline">Stats</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          ) : (
            <div className="space-y-4">
              {filteredGalleries.map((gallery) => {
                const status = gallery.status || 'DRAFT';
                const statusText = status.replace('_', ' ').toLowerCase();
                const statusColor = getStatusColor(status);

                return (
                  <div 
                    key={gallery.id} 
                    className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:shadow-sm"
                    style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={gallery.images.length > 0 ? gallery.images[0].url : '/images/placeholder.png'}
                          alt={gallery.title}
                          className="object-cover"
                          fill
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                           <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColor}`}>
                            {statusText}
                          </span>
                          <h3 className="font-medium line-clamp-1" style={{ color: 'var(--color-textPrimary)' }}>
                            {gallery.title}
                          </h3>
                        </div>
                        <p className="text-sm line-clamp-1 mb-1" style={{ color: 'var(--color-textSecondary)' }}>
                          {gallery.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                          <span>Created {formatDate(gallery.createdAt)}</span>
                          <span className="flex items-center space-x-1">
                            <Eye size={12} />
                            <span>{formatNumber(gallery.viewCount)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/creator/galleries/${gallery.id}`}
                        className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-500/10"
                        title="View"
                      >
                        <Eye size={16} />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(gallery)}
                        className="p-2 h-auto rounded-lg transition-colors text-blue-500 hover:bg-blue-500/10"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Link
                        href={`/creator/analytics/${gallery.id}`}
                        className="p-2 rounded-lg transition-colors text-purple-500 hover:bg-purple-500/10"
                        title="Analytics"
                      >
                        <BarChart2 size={16} />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
                        className="p-2 h-auto rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}