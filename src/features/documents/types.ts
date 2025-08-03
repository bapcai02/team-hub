export interface Document {
  id: number;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: 'project' | 'meeting' | 'policy' | 'template' | 'other';
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  created_by: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface DocumentStats {
  total: number;
  by_category: {
    project?: number;
    meeting?: number;
    policy?: number;
    template?: number;
    other?: number;
  };
  by_status: {
    draft?: number;
    published?: number;
    archived?: number;
  };
  recent_uploads: number;
  total_size: number;
}

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  category: 'project' | 'meeting' | 'policy' | 'template' | 'other';
  tags?: string[];
  project_id?: number;
  file: File;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  category?: 'project' | 'meeting' | 'policy' | 'template' | 'other';
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  project_id?: number;
}

export interface DocumentComment {
  id: number;
  document_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateDocumentCommentRequest {
  content: string;
} 