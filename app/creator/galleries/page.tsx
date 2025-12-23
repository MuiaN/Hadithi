'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Eye, EyeOff, Edit, ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Image from 'next/image';

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  alt: string;
  fileName?: string; // To store the original file name
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
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
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as GalleryImage[],
    tags: '',
    isPublished: false,
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
        const res = await fetch('/api/v1/creator/galleries');
        if (!res.ok) throw new Error('Failed to fetch galleries');
        const data = await res.json();
        setGalleries(data);
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Could not load your galleries.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const galleryData = {
      title: formData.title,
      description: formData.description,
      images: formData.images,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isFree: formData.isFree,
      subscriptionTier: formData.isFree ? null : formData.subscriptionTier,
    };

    try {
      let response;
      if (editingGallery) {
        response = await fetch(`/api/v1/creator/galleries/${editingGallery.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryData),
        });
      } else {
        response = await fetch('/api/v1/creator/galleries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(galleryData),
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

  const togglePublish = async (gallery: Gallery) => {
    try {
      const response = await fetch(`/api/v1/creator/galleries/${gallery.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !gallery.isPublished, // Toggle the status
          publishedAt: !gallery.isPublished ? new Date().toISOString() : null, // Set or clear publish date
        }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      const updated = await response.json();
      setGalleries(galleries.map(g => g.id === updated.id ? updated : g));
      toast({
        title: 'Success',
        description: `Gallery ${updated.isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update gallery status',
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
      tags: gallery.tags.join(', '),
      isPublished: gallery.isPublished,
      isFree: gallery.isFree ?? true,
      subscriptionTier: gallery.subscriptionTier,
    });
    setIsDialogOpen(true);
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
            { ...newImage, url, id: crypto.randomUUID(), fileName: file.name }
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
      tags: '',
      isPublished: false,
      isFree: true,
      subscriptionTier: null,
    });
    setNewImage({ url: '', caption: '', alt: '' });
    setEditingGallery(null);
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

        {/* Create Gallery Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'} created
            </p>
          </div>
          {/* This button was missing its trigger logic, moved inside the flex container */}
          <Button onClick={() => setIsDialogOpen(true)} style={{ backgroundColor: 'var(--color-primary)' }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Gallery
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose(); else setIsDialogOpen(true); }}>
            {/* This DialogTrigger is now handled by the onClick of the button below */}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-card)' }}>
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--color-textPrimary)' }}>
                  {editingGallery ? 'Edit Gallery' : 'Create New Gallery'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="tags" style={{ color: 'var(--color-textPrimary)' }}>Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="nature, landscape, photography"
                    style={{
                      backgroundColor: 'var(--color-input)',
                      borderColor: 'var(--color-inputBorder)',
                      color: 'var(--color-textPrimary)'
                    }}
                  />
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
                  <Button type="submit" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {editingGallery ? 'Update Gallery' : 'Create Gallery'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {galleries.length === 0 ? (
          <Card style={{ backgroundColor: 'var(--color-card)' }}>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
                <ImageIcon size={32} style={{ color: 'var(--color-textTertiary)' }} />
              </div>
              <p className="text-lg mb-4" style={{ color: 'var(--color-textSecondary)' }}>No galleries found</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Gallery
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => {
              const statusText = gallery.isPublished ? 'Published' : 'Draft';
              const statusColor = gallery.isPublished ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';

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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
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
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublish(gallery)}
                        className="col-span-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                        style={{ backgroundColor: 'var(--color-backgroundSecondary)', color: 'var(--color-textPrimary)' }}
                      >
                        {gallery.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span className="hidden sm:inline">{gallery.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </Button>
                      <Button
                        onClick={() => handleEdit(gallery)}
                        size="sm"
                        className="col-span-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm transition-colors"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}