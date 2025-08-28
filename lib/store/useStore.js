'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTheme, applyTheme } from '@/lib/themes';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      currentTheme: 'light',
      setTheme: (themeName) => {
        const theme = getTheme(themeName);
        if (typeof window !== 'undefined') {
          applyTheme(theme);
        }
        set({ currentTheme: themeName });
      },

      // Template
      currentTemplate: 'baobab',
      setTemplate: (templateName) => {
        if (typeof window !== 'undefined') {
          const { applyTemplate, getTemplate } = require('@/lib/templates');
          const template = getTemplate(templateName);
          applyTemplate(template);
        }
        set({ currentTemplate: templateName });
      },

      // User Authentication
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),

      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Content filters
      contentFilters: {
        type: 'all',
        tags: [],
        author: '',
        search: '',
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      },
      updateContentFilters: (filters) => set((state) => ({
        contentFilters: { ...state.contentFilters, ...filters }
      })),
      resetContentFilters: () => set({
        contentFilters: {
          type: 'all',
          tags: [],
          author: '',
          search: '',
          sortBy: 'publishedAt',
          sortOrder: 'desc'
        }
      }),

      // Notification system
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...notification
        }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Sidebar/Navigation state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Content interaction
      likedContent: [],
      toggleLike: (contentId) => set((state) => {
        const isLiked = state.likedContent.includes(contentId);
        return {
          likedContent: isLiked
            ? state.likedContent.filter(id => id !== contentId)
            : [...state.likedContent, contentId]
        };
      }),

      // Reading progress
      readingProgress: {},
      updateReadingProgress: (contentId, progress) => set((state) => ({
        readingProgress: {
          ...state.readingProgress,
          [contentId]: progress
        }
      }))
    }),
    {
      name: 'hadithi-store',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        likedContent: state.likedContent,
        readingProgress: state.readingProgress
      })
    }
  )
);

export default useStore;