'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Eye, EyeOff, Edit, Calendar, Tag, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGalleriesStore, GalleryImage, Gallery } from '@/lib/store/galleriesStore';
import Image from 'next/image';

export default function AdminGalleriesPage() {
  const galleries = useGalleriesStore((state) => state.getUserGalleries());
  const addGallery = useGalleriesStore((state) => state.addGallery);
  const updateGallery = useGalleriesStore((state) => state.updateGallery);
  const deleteGallery = useGalleriesStore((state) => state.deleteGallery);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as GalleryImage[],
    tags: '',
    is_published: false,
  });

  const [newImage, setNewImage] = useState({
    url: '',
    caption: '',
    alt: '',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const galleryData = {
      title: formData.title,
      description: formData.description,
      images: formData.images,
      is_published: formData.is_published,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    try {
      if (editingGallery) {
        updateGallery(editingGallery.id, galleryData);
      } else {
        addGallery(galleryData);
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
      deleteGallery(id);
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
      updateGallery(gallery.id, { 
        is_published: !gallery.is_published,
        published_at: !gallery.is_published ? new Date().toISOString() : null
      });
      toast({
        title: 'Success',
        description: `Gallery ${!gallery.is_published ? 'published' : 'unpublished'}`,
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
      is_published: gallery.is_published,
    });
    setIsDialogOpen(true);
  };

  const addImageToGallery = () => {
    if (!newImage.url) {
      toast({
        title: 'Error',
        description: 'Image URL is required',
        variant: 'destructive',
      });
      return;
    }

    setFormData({
      ...formData,
      images: [...formData.images, { ...newImage }],
    });

    setNewImage({ url: '', caption: '', alt: '' });
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
      is_published: false,
    });
    setNewImage({ url: '', caption: '', alt: '' });
    setEditingGallery(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
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
            Admin Galleries
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Manage and organize all image galleries
          </p>
        </div>

        {/* Create Gallery Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'} total
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Gallery
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-card)' }}>
              <DialogHeader>
                <DialogTitle style={{ color: 'var(--color-textPrimary)' }}>
                  {editingGallery ? 'Edit Gallery' : 'Create New Gallery'}
                </DialogTitle>
                <DialogDescription style={{ color: 'var(--color-textSecondary)' }}>
                  {editingGallery ? 'Update gallery information' : 'Add images and information to create a new gallery'}
                </DialogDescription>
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_published" style={{ color: 'var(--color-textPrimary)' }}>Publish gallery</Label>
                </div>

                <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Images</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <Label htmlFor="image-url" style={{ color: 'var(--color-textPrimary)' }}>Image URL</Label>
                      <Input
                        id="image-url"
                        value={newImage.url}
                        onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                        placeholder="/images/your-image.jpg"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-caption" style={{ color: 'var(--color-textPrimary)' }}>Caption</Label>
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
                      <Label htmlFor="image-alt" style={{ color: 'var(--color-textPrimary)' }}>Alt Text</Label>
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
                    <Button type="button" onClick={addImageToGallery} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                        Added Images ({formData.images.length})
                      </h4>
                      <div className="grid gap-2">
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
                                {img.url}
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
            {galleries.map((gallery) => (
              <Card
                key={gallery.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {gallery.images.length > 0 ? (
                    <Image
                      src={gallery.images[0].url}
                      alt={gallery.images[0].alt}
                      className="w-full h-full object-cover"
                      width={400}
                      height={225}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full" style={{ color: 'var(--color-textSecondary)' }}>
                      No images
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      className="shadow-sm font-medium text-white"
                      style={{ 
                        background: gallery.is_published ? 'var(--gradient-primary)' : 'var(--color-secondary)'
                      }}
                    >
                      {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant={gallery.is_published ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {gallery.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {gallery.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                    {gallery.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(gallery.view_count)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(gallery.published_at)}</span>
                        </div>
                      </div>
                    </div>
                    {gallery.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {gallery.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {gallery.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{gallery.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(gallery)}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublish(gallery)}
                        className="flex-1"
                      >
                        {gallery.is_published ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(gallery.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}