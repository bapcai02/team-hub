import axios from 'axios';

// Laravel API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Chat API client
export const chatApiClient = axios.create({
  baseURL: process.env.REACT_APP_CHAT_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from user object first (like axiosInstance)
    const userStr = localStorage.getItem('user');
    let token = '';
        
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.data?.access_token || user.data?.['access-token'] || '';
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Fallback to direct token storage
    if (!token) {
      const directToken = localStorage.getItem('token') || localStorage.getItem('access-token') || '';
      token = directToken;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found - request will be sent without Authorization header');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - don't clear token automatically
      console.log('401 Error - Token might be expired or invalid');
      // Only clear token if it's actually expired, not on every 401
      // Let the application handle authentication errors
    }
    return Promise.reject(error);
  }
);

// Add same interceptors to chat API client
chatApiClient.interceptors.request.use(
  (config) => {
    // Try to get token from user object first (like axiosInstance)
    const userStr = localStorage.getItem('user');
    let token = '';
        
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.data?.access_token || user.data?.['access-token'] || '';
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Fallback to direct token storage
    if (!token) {
      const directToken = localStorage.getItem('token') || localStorage.getItem('access-token') || '';
      token = directToken;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found - request will be sent without Authorization header');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

chatApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Error - Token might be expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default apiClient; 