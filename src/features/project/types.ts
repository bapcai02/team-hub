export interface Project {
  id: string | number;
  name: string;
  description?: string;
  owner_id: string | number;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'planning' | 'active' | 'completed' | 'archived';
  progress_percent?: number;
  total_members?: number;
  total_tasks?: number;
  members?: ProjectMember[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMember {
  user_id: string | number;
  role: 'admin' | 'member';
}

export interface CreateProjectMember extends ProjectMember {}

export interface ProjectAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  owner_id: string | number;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'planning' | 'active' | 'completed' | 'archived';
  members: number[];
  attachments?: ProjectAttachment[];
}

export interface ProjectState {
  list: Project[];
  detail: Project | null;
  loading: boolean;
  error: any;
}