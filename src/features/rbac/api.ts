import axios from 'axios';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  AuditLog,
  RBACFilters,
  PermissionCheck,
  Module
} from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

export const rbacApi = {
  // Roles
  getRoles: async (): Promise<Role[]> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/roles`);
    return response.data.data;
  },

  getRole: async (id: number): Promise<Role> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/roles/${id}`);
    return response.data.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await axios.post(`${API_BASE_URL}/rbac/roles`, data);
    return response.data.data;
  },

  updateRole: async (id: number, data: UpdateRoleRequest): Promise<Role> => {
    const response = await axios.put(`${API_BASE_URL}/rbac/roles/${id}`, data);
    return response.data.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/rbac/roles/${id}`);
  },

  // Permissions
  getPermissions: async (): Promise<{ [key: string]: Permission[] }> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/permissions`);
    return response.data.data;
  },

  getPermissionsByModule: async (module: string): Promise<Permission[]> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/permissions/module/${module}`);
    return response.data.data;
  },

  createPermission: async (data: CreatePermissionRequest): Promise<Permission> => {
    const response = await axios.post(`${API_BASE_URL}/rbac/permissions`, data);
    return response.data.data;
  },

  updatePermission: async (id: number, data: UpdatePermissionRequest): Promise<Permission> => {
    const response = await axios.put(`${API_BASE_URL}/rbac/permissions/${id}`, data);
    return response.data.data;
  },

  deletePermission: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/rbac/permissions/${id}`);
  },

  // User Roles & Permissions
  assignRolesToUser: async (userId: number, roleIds: number[]): Promise<void> => {
    await axios.post(`${API_BASE_URL}/rbac/users/${userId}/roles`, { role_ids: roleIds });
  },

  getUserPermissions: async (userId: number): Promise<Permission[]> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/users/${userId}/permissions`);
    return response.data.data;
  },

  checkUserPermission: async (userId: number, permission: string): Promise<PermissionCheck> => {
    const response = await axios.post(`${API_BASE_URL}/rbac/users/${userId}/check-permission`, { permission });
    return response.data.data;
  },

  getUsersByRole: async (roleName: string): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/users/role/${roleName}`);
    return response.data.data;
  },

  // Audit Logs
  getAuditLogs: async (filters?: RBACFilters): Promise<AuditLog[]> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/audit-logs`, { params: filters });
    return response.data.data;
  },

  // Modules
  getAvailableModules: async (): Promise<Module> => {
    const response = await axios.get(`${API_BASE_URL}/rbac/modules`);
    return response.data.data;
  },
}; 