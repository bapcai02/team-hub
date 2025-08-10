import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    let token = '';
    
    console.log('=== Axios Service Request Interceptor ===');
    console.log('User string from localStorage:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Parsed user object:', user);
        // Try different possible token locations
        token = user.data?.['access-token'] || 
                user['access-token'] || 
                user.data?.access_token || 
                user.access_token || '';
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
    
    console.log('Final token for request:', token ? 'Token exists' : 'No token found');
    console.log('API Request URL:', config.url);
    
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('No token found - request will be sent without Authorization header');
    }
    
    console.log('=== End Axios Service Request Interceptor ===');
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
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

// Wrapper methods
const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.get<T>(url, config);

const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.post<T>(url, data, config);

const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.put<T>(url, data, config);

const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.delete<T>(url, config);

const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axiosInstance.patch<T>(url, data, config);

export default {
  ...axiosInstance,
  get,
  post,
  put,
  delete: del,
  patch,
};