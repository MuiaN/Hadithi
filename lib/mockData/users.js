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
    bio: 'Senior Content Editor specializing in West African literature and oral traditions. With over 15 years of experience in cultural preservation, Kwame has dedicated his career to ensuring that African stories are told with authenticity and respect. He holds a PhD in African Studies from the University of Ghana and has published extensively on traditional storytelling methods.',
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
    bio: 'Storyteller and cultural preservationist from Mali, descended from a long line of griots. Amara specializes in preserving and sharing the oral traditions of the Mandinka people. She travels extensively across West Africa, collecting stories and working with elders to ensure these precious narratives are not lost to time.',
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
    bio: 'Passionate reader of African literature and advocate for cultural education. Fatima works as a librarian in Lagos and is dedicated to promoting African authors and stories in educational settings. She believes in the power of literature to bridge cultural divides and foster understanding.',
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
  },
  {
    id: '6',
    email: 'author1@example.com',
    name: 'Chinua Achebe Jr.',
    role: 'creator',
    subscription: 'gold',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Contemporary African author following in the footsteps of literary giants. Specializes in modern African fiction that explores themes of identity, tradition, and change in post-colonial Africa.',
    createdAt: '2024-01-20T00:00:00.000Z',
    isVerified: true
  },
  {
    id: '7',
    email: 'historian@example.com',
    name: 'Dr. Aisha Mbeki',
    role: 'creator',
    subscription: 'silver',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Historian and researcher specializing in pre-colonial African civilizations. Dr. Mbeki has spent decades studying the great kingdoms of Africa and works to correct historical misconceptions about the continent\'s rich past.',
    createdAt: '2024-01-25T00:00:00.000Z',
    isVerified: true
  }
];

// Mock passwords (in real app, these would be hashed)
export const userCredentials = {
  'admin@hadithi.com': 'admin123',
  'editor@hadithi.com': 'editor123',
  'creator@hadithi.com': 'creator123',
  'user@example.com': 'user123'
};