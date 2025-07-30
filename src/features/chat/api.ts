import axios from '../../services/axios';
import { CreateConversationDto, CreateMessageDto } from '../../types/chat';

const API_BASE_URL = process.env.REACT_APP_CHAT_API_URL || 'http://localhost:3001/api';

// Tạo axios instance cho chat API
const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Chat API Request - No token found in localStorage');
  }
  
  return config;
});

// Interceptor để xử lý response
chatApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Chat API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Conversations
export const fetchConversations = () => chatApi.get('/conversations');
export const fetchConversation = (id: number) => chatApi.get(`/conversations/${id}`);
export const createConversation = (data: CreateConversationDto) => chatApi.post('/conversations', data);
export const updateConversation = (id: number, data: any) => chatApi.put(`/conversations/${id}`, data);
export const deleteConversation = (id: number) => chatApi.delete(`/conversations/${id}`);

// Messages
export const fetchMessages = (conversationId: number) => chatApi.get(`/messages/conversations/${conversationId}`);
export const sendMessage = (conversationId: number, data: CreateMessageDto) => chatApi.post(`/messages/conversations/${conversationId}`, data);
export const updateMessage = (messageId: number, data: any) => chatApi.put(`/messages/${messageId}`, data);
export const deleteMessage = (messageId: number) => chatApi.delete(`/messages/${messageId}`);

// Reactions
export const addReaction = (messageId: number, emoji: string) => chatApi.post(`/messages/${messageId}/reactions`, { emoji });
export const removeReaction = (messageId: number, emoji: string) => chatApi.delete(`/messages/${messageId}/reactions`, { data: { emoji } });

// Read receipts
export const markAsRead = (conversationId: number) => chatApi.post(`/conversations/${conversationId}/read`);

// Search
export const searchConversations = (query: string) => chatApi.get(`/conversations/search?q=${encodeURIComponent(query)}`);
export const searchMessages = (conversationId: number, query: string) => chatApi.get(`/messages/conversations/${conversationId}/search?q=${encodeURIComponent(query)}`); 