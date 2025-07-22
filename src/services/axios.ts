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
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.data.access_token || '';
      } catch {}
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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