export interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  module: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  is_active?: boolean;
  permissions?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  permissions?: number[];
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
  module: string;
  is_active?: boolean;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
  module?: string;
  is_active?: boolean;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  target_table: string;
  target_id: number;
  data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RBACFilters {
  action?: string;
  table?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface PermissionCheck {
  user_id: number;
  permission: string;
  has_permission: boolean;
}

export interface Module {
  [key: string]: string;
} 