import axios from '../../services/axios';
import { CreateDocumentRequest, UpdateDocumentRequest, CreateDocumentCommentRequest } from './types';

export const documentsApi = {
  // Get all documents with filters
  getDocuments: (params?: any) => {
    return axios.get('/documents', { params });
  },

  // Get document by ID
  getDocument: (id: number) => {
    return axios.get(`/documents/${id}`);
  },

  // Create new document
  createDocument: (data: CreateDocumentRequest) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.project_id) formData.append('project_id', data.project_id.toString());
    formData.append('file', data.file);

    return axios.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update document
  updateDocument: (id: number, data: UpdateDocumentRequest) => {
    return axios.put(`/documents/${id}`, data);
  },

  // Delete document
  deleteDocument: (id: number) => {
    return axios.delete(`/documents/${id}`);
  },

  // Get document statistics
  getStats: () => {
    return axios.get('/documents/stats');
  },

  // Download document
  downloadDocument: (id: number) => {
    return axios.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
  },

  // Get document comments
  getComments: (id: number) => {
    return axios.get(`/documents/${id}/comments`);
  },

  // Add comment to document
  addComment: (id: number, data: CreateDocumentCommentRequest) => {
    return axios.post(`/documents/${id}/comments`, data);
  },

  // Delete comment
  deleteComment: (documentId: number, commentId: number) => {
    return axios.delete(`/documents/${documentId}/comments/${commentId}`);
  },

  // Search documents
  searchDocuments: (query: string, params?: any) => {
    return axios.get('/documents/search', { 
      params: { q: query, ...params } 
    });
  },

  // Get documents by category
  getDocumentsByCategory: (category: string, params?: any) => {
    return axios.get(`/documents/category/${category}`, { params });
  },

  // Get recent documents
  getRecentDocuments: (limit: number = 10) => {
    return axios.get('/documents/recent', { params: { limit } });
  },
}; 