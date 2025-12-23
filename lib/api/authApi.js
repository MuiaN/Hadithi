
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
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  },

  async register(userData) {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  async forgotPassword(email) {
    // This will be implemented later with a real backend
    console.log('Forgot password for:', email);
    // await apiClient.delay();
    // const user = users.find(u => u.email === email);
    // if (!user) {
    //   throw new Error('No account found with this email');
    // }

    // In real implementation, send reset email
    return {
      message: 'Password reset instructions sent to your email'
    };
  },
  
  async resetPassword(token, newPassword) {
    // await apiClient.delay();
    
    // In mock, just simulate success
    return {
      message: 'Password reset successful'
    };
  },
  
  async logout() {
    // apiClient.setAuthToken(null);
    return { message: 'Logged out successfully' };
  },

  async refreshToken() {
    // await apiClient.delay();
    // const currentToken = apiClient.getAuthToken();
    // if (!currentToken) {
    //   throw new Error('No token to refresh');
    // }

    // In real implementation, validate and refresh token
    return {
      token: currentToken,
      message: 'Token refreshed'
    };
  },

  async getProfile(userId) {
    // await apiClient.delay();
    
    // const user = users.find(u => u.id === userId);
    // if (!user) {
    //   throw new Error('User not found');
    // }

    // return { ...user, password: undefined };
  },

  async updateProfile(userId, updates) {
    // await apiClient.delay();
    
    // const userIndex = users.findIndex(u => u.id === userId);
    // if (userIndex === -1) {
    //   throw new Error('User not found');
    // }

    // users[userIndex] = {
    //   ...users[userIndex],
    //   ...updates,
    //   updatedAt: new Date().toISOString()
    // };

    // return { ...users[userIndex], password: undefined };
  }
};