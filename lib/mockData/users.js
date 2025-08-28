// Mock user data
export const users = [
  {
    id: '1',
    email: 'admin@hadithi.com',
    name: 'Admin User',
    role: 'admin',
    subscription: 'gold',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Platform administrator',
    createdAt: '2024-01-01T00:00:00.000Z',
    isVerified: true
  },
  {
    id: '2',
    email: 'editor@hadithi.com',
    name: 'Kwame Asante',
    role: 'editor',
    subscription: 'silver',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Senior Content Editor specializing in West African literature',
    createdAt: '2024-01-15T00:00:00.000Z',
    isVerified: true
  },
  {
    id: '3',
    email: 'creator@hadithi.com',
    name: 'Amara Kone',
    role: 'creator',
    subscription: 'bronze',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Storyteller and cultural preservationist from Mali',
    createdAt: '2024-02-01T00:00:00.000Z',
    isVerified: true
  },
  {
    id: '4',
    email: 'user@example.com',
    name: 'Fatima Okafor',
    role: 'user',
    subscription: 'bronze',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Passionate reader of African literature',
    createdAt: '2024-02-15T00:00:00.000Z',
    isVerified: false
  },
  {
    id: '5',
    email: 'guest@example.com',
    name: 'Guest User',
    role: 'guest',
    subscription: null,
    avatar: null,
    bio: null,
    createdAt: null,
    isVerified: false
  }
];

// Mock passwords (in real app, these would be hashed)
export const userCredentials = {
  'admin@hadithi.com': 'admin123',
  'editor@hadithi.com': 'editor123',
  'creator@hadithi.com': 'creator123',
  'user@example.com': 'user123'
};