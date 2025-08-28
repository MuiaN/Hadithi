import { users, userCredentials } from '@/lib/mockData/users';
import { apiClient } from './index';

// Mock JWT token generation
function generateMockToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

export const authApi = {
  async login(email, password) {
    await apiClient.delay();
    
    const user = users.find(u => u.email === email);
    if (!user || userCredentials[email] !== password) {
      throw new Error('Invalid email or password');
    }

    const token = generateMockToken(user);
    apiClient.setAuthToken(token);
    
    return {
      user: { ...user, password: undefined },
      token,
      message: 'Login successful'
    };
  },

  async register(userData) {
    await apiClient.delay();
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: String(users.length + 1),
      ...userData,
      role: 'user',
      subscription: null,
      avatar: null,
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    // Add to mock data
    users.push(newUser);
    userCredentials[userData.email] = userData.password;

    const token = generateMockToken(newUser);
    apiClient.setAuthToken(token);

    return {
      user: { ...newUser, password: undefined },
      token,
      message: 'Registration successful'
    };
  },

  async forgotPassword(email) {
    await apiClient.delay();
    
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('No account found with this email');
    }

    // In real implementation, send reset email
    return {
      message: 'Password reset instructions sent to your email'
    };
  },

  async resetPassword(token, newPassword) {
    await apiClient.delay();
    
    // In mock, just simulate success
    return {
      message: 'Password reset successful'
    };
  },

  async logout() {
    apiClient.setAuthToken(null);
    return { message: 'Logged out successfully' };
  },

  async refreshToken() {
    await apiClient.delay();
    
    const currentToken = apiClient.getAuthToken();
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    // In real implementation, validate and refresh token
    return {
      token: currentToken,
      message: 'Token refreshed'
    };
  },

  async getProfile(userId) {
    await apiClient.delay();
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return { ...user, password: undefined };
  },

  async updateProfile(userId, updates) {
    await apiClient.delay();
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return { ...users[userIndex], password: undefined };
  }
};