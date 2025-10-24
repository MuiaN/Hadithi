import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockGalleries } from '@/lib/mockData/galleries';

export interface GalleryImage {
  url: string;
  caption: string;
  alt: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  tags: string[];
  view_count: number;
}

interface GalleriesState {
  galleries: Gallery[];
  addGallery: (gallery: Omit<Gallery, 'id' | 'created_at' | 'updated_at' | 'view_count'>) => void;
  updateGallery: (id: string, updates: Partial<Gallery>) => void;
  deleteGallery: (id: string) => void;
  incrementViewCount: (id: string) => void;
  getPublishedGalleries: () => Gallery[];
  getUserGalleries: (userId?: string) => Gallery[];
}

export const useGalleriesStore = create<GalleriesState>()(
  persist(
    (set, get) => ({
      galleries: [],

      addGallery: (gallery) => {
        const newGallery: Gallery = {
          ...gallery,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          view_count: 0,
        };

        set((state) => ({
          galleries: [...state.galleries, newGallery],
        }));
      },

      updateGallery: (id, updates) => {
        set((state) => ({
          galleries: state.galleries.map((gallery) =>
            gallery.id === id
              ? {
                  ...gallery,
                  ...updates,
                  updated_at: new Date().toISOString(),
                  published_at:
                    updates.is_published !== undefined
                      ? updates.is_published
                        ? new Date().toISOString()
                        : null
                      : gallery.published_at,
                }
              : gallery
          ),
        }));
      },

      deleteGallery: (id) => {
        set((state) => ({
          galleries: state.galleries.filter((gallery) => gallery.id !== id),
        }));
      },

      incrementViewCount: (id) => {
        set((state) => ({
          galleries: state.galleries.map((gallery) =>
            gallery.id === id
              ? { ...gallery, view_count: gallery.view_count + 1 }
              : gallery
          ),
        }));
      },

      getPublishedGalleries: () => {
        const state = get();
        // Use mock data if no galleries in store
        if (state.galleries.length === 0) {
          return mockGalleries.filter((gallery) => gallery.is_published);
        }
        return state.galleries.filter((gallery) => gallery.is_published);
      },

      getUserGalleries: (userId) => {
        const state = get();
        // Use mock data if no galleries in store
        if (state.galleries.length === 0) {
          return mockGalleries;
        }
        return state.galleries;
      },
    }),
    {
      name: 'galleries-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.galleries.length === 0) {
          // Initialize with mock data on first load
          state.galleries = mockGalleries;
        }
      },
      skipHydration: true,
    }
  )
);