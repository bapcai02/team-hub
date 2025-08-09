import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document, DocumentStats, CreateDocumentRequest, UpdateDocumentRequest, DocumentComment, CreateDocumentCommentRequest } from './types';
import { documentsApi } from './api';

export interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  stats: DocumentStats | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    category?: string;
    status?: string;
    project_id?: number;
  };
}

const initialState: DocumentsState = {
  documents: [],
  selectedDocument: null,
  stats: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {},
};

// Async thunks
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params: any = undefined, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getDocuments(params);
      const data = response.data.data;
      
      // Handle pagination response from Laravel
      if (data && typeof data === 'object' && data.data) {
        return data.data; // Extract the actual documents array from pagination
      }
      
      // Handle direct array response (fallback)
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const fetchDocument = createAsyncThunk(
  'documents/fetchDocument',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getDocument(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch document');
    }
  }
);

export const createDocument = createAsyncThunk(
  'documents/createDocument',
  async (data: CreateDocumentRequest, { rejectWithValue }) => {
    try {
      const response = await documentsApi.createDocument(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create document');
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ id, ...data }: { id: number } & UpdateDocumentRequest, { rejectWithValue }) => {
    try {
      const response = await documentsApi.updateDocument(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id: number, { rejectWithValue }) => {
    try {
      await documentsApi.deleteDocument(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

export const fetchDocumentStats = createAsyncThunk(
  'documents/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getStats();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch document stats');
    }
  }
);

export const searchDocuments = createAsyncThunk(
  'documents/searchDocuments',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await documentsApi.searchDocuments(query);
      const data = response.data.data;
      
      // Handle pagination response from Laravel
      if (data && typeof data === 'object' && data.data) {
        return data.data; // Extract the actual documents array from pagination
      }
      
      // Handle direct array response (fallback)
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search documents');
    }
  }
);

export const addDocumentComment = createAsyncThunk(
  'documents/addComment',
  async ({ documentId, data }: { documentId: number; data: CreateDocumentCommentRequest }, { rejectWithValue }) => {
    try {
      const response = await documentsApi.addComment(documentId, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

// Document Versions
export const fetchDocumentVersions = createAsyncThunk(
  'documents/fetchVersions',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getVersions(documentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch versions');
    }
  }
);

export const createDocumentVersion = createAsyncThunk(
  'documents/createVersion',
  async ({ documentId, file, changeLog }: { documentId: number; file: File; changeLog?: string }, { rejectWithValue }) => {
    try {
      const response = await documentsApi.createVersion(documentId, file, changeLog);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create version');
    }
  }
);

export const deleteDocumentVersion = createAsyncThunk(
  'documents/deleteVersion',
  async ({ documentId, versionId }: { documentId: number; versionId: number }, { rejectWithValue }) => {
    try {
      await documentsApi.deleteVersion(documentId, versionId);
      return versionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete version');
    }
  }
);

// Document Sharing
export const fetchSharedUsers = createAsyncThunk(
  'documents/fetchSharedUsers',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getSharedUsers(documentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shared users');
    }
  }
);

export const shareDocument = createAsyncThunk(
  'documents/shareDocument',
  async ({ documentId, userIds, permission, expiresAt }: { 
    documentId: number; 
    userIds: number[]; 
    permission: string; 
    expiresAt?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await documentsApi.shareDocument(documentId, userIds, permission, expiresAt);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share document');
    }
  }
);

export const unshareDocument = createAsyncThunk(
  'documents/unshareDocument',
  async ({ documentId, userId }: { documentId: number; userId: number }, { rejectWithValue }) => {
    try {
      await documentsApi.unshareDocument(documentId, userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unshare document');
    }
  }
);

export const updateSharePermission = createAsyncThunk(
  'documents/updateSharePermission',
  async ({ documentId, userId, permission }: { 
    documentId: number; 
    userId: number; 
    permission: string 
  }, { rejectWithValue }) => {
    try {
      const response = await documentsApi.updateSharePermission(documentId, userId, permission);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update permission');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'documents/searchUsers',
  async ({ query, excludeUserIds }: { query: string; excludeUserIds?: number[] }, { rejectWithValue }) => {
    try {
      const response = await documentsApi.searchUsers(query, excludeUserIds);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DocumentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload || [];
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single document
    builder
      .addCase(fetchDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDocument = action.payload;
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create document
    builder
      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.documents) {
          state.documents = [];
        }
        state.documents.unshift(action.payload);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update document
    builder
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.documents) {
          const index = state.documents.findIndex(doc => doc.id === action.payload.id);
          if (index !== -1) {
            state.documents[index] = action.payload;
          }
        }
        if (state.selectedDocument?.id === action.payload.id) {
          state.selectedDocument = action.payload;
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete document
    builder
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.documents) {
          state.documents = state.documents.filter(doc => doc.id !== action.payload);
        }
        if (state.selectedDocument?.id === action.payload) {
          state.selectedDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch stats
    builder
      .addCase(fetchDocumentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDocumentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search documents
    builder
      .addCase(searchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload || [];
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add comment
    builder
      .addCase(addDocumentComment.fulfilled, (state, action) => {
        // Handle comment addition if needed
      });
  },
});

export const { 
  setSelectedDocument, 
  setSearchQuery, 
  setFilters, 
  clearFilters, 
  clearError 
} = documentsSlice.actions;

export default documentsSlice.reducer; 