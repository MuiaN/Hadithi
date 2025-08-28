import axios from 'axios';

// Mock API client that simulates real API calls
class ApiClient {
  constructor() {
    this.baseURL = 'https://api.hadithi.com'; // This will be real later
    this.timeout = 5000;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  // Simulate network delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock HTTP methods
  async get(url, config = {}) {
    await this.delay();
    // In real implementation: return axios.get(url, config);
    console.log(`Mock GET: ${url}`, config);
    return { data: null, status: 200, statusText: 'OK' };
  }

  async post(url, data, config = {}) {
    await this.delay();
    // In real implementation: return axios.post(url, data, config);
    console.log(`Mock POST: ${url}`, data, config);
    return { data, status: 201, statusText: 'Created' };
  }

  async put(url, data, config = {}) {
    await this.delay();
    // In real implementation: return axios.put(url, data, config);
    console.log(`Mock PUT: ${url}`, data, config);
    return { data, status: 200, statusText: 'OK' };
  }

  async delete(url, config = {}) {
    await this.delay();
    // In real implementation: return axios.delete(url, config);
    console.log(`Mock DELETE: ${url}`, config);
    return { data: null, status: 204, statusText: 'No Content' };
  }

  // Set authorization header (for future JWT tokens)
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Get current auth token
  getAuthToken() {
    return this.defaultHeaders['Authorization'];
  }
}

export const apiClient = new ApiClient();
export default apiClient;