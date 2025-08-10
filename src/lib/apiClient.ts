import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost/api',
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
    
    console.log('=== API Client Request Interceptor ===');
    console.log('User string from localStorage:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Parsed user object:', user);
        token = user.data?.access_token || user.data?.['access-token'] || '';
        console.log('Token from user object:', token);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    
    // Fallback to direct token storage
    if (!token) {
      const directToken = localStorage.getItem('token') || localStorage.getItem('access-token') || '';
      console.log('Direct token from localStorage:', directToken);
      token = directToken;
    }
    
    // Debug: log token
    console.log('Final token for request:', token ? 'Token exists' : 'No token found');
    console.log('API Request URL:', config.url);
    console.log('API Request Headers:', config.headers);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('No token found - request will be sent without Authorization header');
    }
    
    console.log('=== End API Client Request Interceptor ===');
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

export default apiClient; 