import { content, comments } from '@/lib/mockData/content';
import { apiClient } from './index';

export const contentApi = {
  async getAllContent(filters = {}) {
    await apiClient.delay();
    
    let filteredContent = [...content];

    // Filter by status (for published content only by default)
    if (!filters.includeUnpublished) {
      filteredContent = filteredContent.filter(c => c.status === 'published');
    }

    // Filter by type
    if (filters.type && filters.type !== 'all') {
      filteredContent = filteredContent.filter(c => c.type === filters.type);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredContent = filteredContent.filter(c =>
        filters.tags.some(tag => c.tags.includes(tag))
      );
    }

    // Filter by author
    if (filters.author) {
      filteredContent = filteredContent.filter(c =>
        c.author.toLowerCase().includes(filters.author.toLowerCase()) ||
        c.authorId === filters.author
      );
    }

    // Search in title and description
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredContent = filteredContent.filter(c =>
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by subscription tier
    if (filters.userTier) {
      const tierHierarchy = { free: 0, bronze: 1, silver: 2, gold: 3 };
      const userTierLevel = tierHierarchy[filters.userTier] || 0;
      
      filteredContent = filteredContent.filter(c => {
        if (c.isFree) return true;
        if (!c.subscriptionTier) return true;
        const contentTierLevel = tierHierarchy[c.subscriptionTier] || 0;
        return userTierLevel >= contentTierLevel;
      });
    }

    // Sort content
    const sortBy = filters.sortBy || 'publishedAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    filteredContent.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'publishedAt' || sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    // Pagination
    if (filters.limit) {
      const start = (filters.page || 0) * filters.limit;
      filteredContent = filteredContent.slice(start, start + filters.limit);
    }

    return {
      content: filteredContent,
      total: filteredContent.length,
      page: filters.page || 0,
      limit: filters.limit || filteredContent.length
    };
  },

  async getContentById(id) {
    await apiClient.delay();
    
    const item = content.find(c => c.id === id);
    if (!item) {
      throw new Error('Content not found');
    }

    // Increment view count (simulate)
    item.views += 1;

    return item;
  },

  async getFeaturedContent(limit = 6) {
    await apiClient.delay();
    
    const publishedContent = content.filter(c => c.status === 'published');
    const featured = publishedContent
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return featured;
  },

  async getLatestContent(limit = 5) {
    await apiClient.delay();
    
    const publishedContent = content.filter(c => c.status === 'published');
    const latest = publishedContent
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);

    return latest;
  },

  async createContent(contentData) {
    await apiClient.delay();
    
    const newContent = {
      id: String(content.length + 1),
      ...contentData,
      status: 'draft',
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0
    };

    content.push(newContent);
    return newContent;
  },

  async updateContent(id, updates) {
    await apiClient.delay();
    
    const index = content.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Content not found');
    }

    content[index] = {
      ...content[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return content[index];
  },

  async deleteContent(id) {
    await apiClient.delay();
    
    const index = content.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Content not found');
    }

    const deleted = content.splice(index, 1)[0];
    return deleted;
  },

  async publishContent(id) {
    await apiClient.delay();
    
    return this.updateContent(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  },

  async likeContent(id, userId) {
    await apiClient.delay();
    
    const item = content.find(c => c.id === id);
    if (!item) {
      throw new Error('Content not found');
    }

    item.likes += 1;
    return { likes: item.likes };
  },

  async getContentComments(contentId) {
    await apiClient.delay();
    
    const contentComments = comments
      .filter(c => c.contentId === contentId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return contentComments;
  },

  async addComment(contentId, userId, userName, userAvatar, comment) {
    await apiClient.delay();
    
    const newComment = {
      id: String(comments.length + 1),
      contentId,
      userId,
      userName,
      userAvatar,
      comment,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    comments.push(newComment);
    return newComment;
  },

  async getAllTags() {
    await apiClient.delay();
    
    const allTags = content.reduce((tags, item) => {
      item.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
      return tags;
    }, []);

    return allTags.sort();
  },

  async getContentByStatus(status) {
    await apiClient.delay();
    
    return content.filter(c => c.status === status);
  },

  async updateContentStatus(id, status) {
    await apiClient.delay();
    
    const updates = { status };
    if (status === 'published') {
      updates.publishedAt = new Date().toISOString();
    }

    return this.updateContent(id, updates);
  },

  // Podcast-specific methods
  async getAllPodcasts(filters = {}) {
    await apiClient.delay();
    
    // Mock podcast data - in real implementation, this would fetch from database
    const podcasts = [
      {
        id: 'p1',
        title: 'Voices of the Ancestors',
        author: 'Kwame Asante',
        authorId: '2',
        description: 'Exploring ancient African wisdom through oral traditions and storytelling.',
        coverImage: 'https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: '45:32',
        audioUrl: '#',
        publishedAt: '2024-02-15T10:00:00.000Z',
        createdAt: '2024-02-10T00:00:00.000Z',
        views: 1240,
        likes: 89,
        tags: ['oral-tradition', 'wisdom', 'ancestors', 'culture'],
        isFree: true,
        status: 'published',
        type: 'podcast'
      },
      {
        id: 'p2',
        title: 'Ubuntu Philosophy Today',
        author: 'Amara Kone',
        authorId: '3',
        description: 'How ancient African philosophy applies to modern community building.',
        coverImage: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: '38:15',
        audioUrl: '#',
        publishedAt: '2024-02-12T14:00:00.000Z',
        createdAt: '2024-02-08T00:00:00.000Z',
        views: 892,
        likes: 67,
        tags: ['ubuntu', 'philosophy', 'community', 'modern'],
        isFree: false,
        status: 'published',
        type: 'podcast'
      }
    ];

    // Apply filters similar to content filtering
    let filteredPodcasts = [...podcasts];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPodcasts = filteredPodcasts.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.author.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredPodcasts = filteredPodcasts.filter(p =>
        filters.tags.some(tag => p.tags.includes(tag))
      );
    }

    return {
      content: filteredPodcasts,
      total: filteredPodcasts.length
    };
  },

  async createPodcast(podcastData) {
    await apiClient.delay();
    
    const newPodcast = {
      id: `p${Date.now()}`,
      ...podcastData,
      type: 'podcast',
      status: 'draft',
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      views: 0
    };
    
    return newPodcast;
  }
};