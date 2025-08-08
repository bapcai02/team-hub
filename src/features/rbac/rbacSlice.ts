import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { rbacApi } from './api';
import {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  RBACFilters,
} from './types';

interface RBACState {
  roles: any;
  permissions: any;
  auditLogs: any;
  modules: any;
  loading: boolean;
  error: string | null;
  selectedRole: any | null;
  selectedPermission: any | null;
}

const initialState: RBACState = {
  roles: [],
  permissions: {},
  auditLogs: [],
  modules: {},
  loading: false,
  error: null,
  selectedRole: null,
  selectedPermission: null,
};

// Async thunks
export const fetchRoles = createAsyncThunk(
  'rbac/fetchRoles',
  async () => {
    return await rbacApi.getRoles();
  }
);

export const fetchPermissions = createAsyncThunk(
  'rbac/fetchPermissions',
  async () => {
    return await rbacApi.getPermissions();
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'rbac/fetchAuditLogs',
  async (filters?: RBACFilters) => {
    return await rbacApi.getAuditLogs(filters);
  }
);

export const fetchModules = createAsyncThunk(
  'rbac/fetchModules',
  async () => {
    return await rbacApi.getAvailableModules();
  }
);

export const createRole = createAsyncThunk(
  'rbac/createRole',
  async (data: CreateRoleRequest) => {
    return await rbacApi.createRole(data);
  }
);

export const updateRole = createAsyncThunk(
  'rbac/updateRole',
  async ({ id, data }: { id: number; data: UpdateRoleRequest }) => {
    return await rbacApi.updateRole(id, data);
  }
);

export const deleteRole = createAsyncThunk(
  'rbac/deleteRole',
  async (id: number) => {
    await rbacApi.deleteRole(id);
    return id;
  }
);

export const createPermission = createAsyncThunk(
  'rbac/createPermission',
  async (data: CreatePermissionRequest) => {
    return await rbacApi.createPermission(data);
  }
);

export const updatePermission = createAsyncThunk(
  'rbac/updatePermission',
  async ({ id, data }: { id: number; data: UpdatePermissionRequest }) => {
    return await rbacApi.updatePermission(id, data);
  }
);

export const deletePermission = createAsyncThunk(
  'rbac/deletePermission',
  async (id: number) => {
    await rbacApi.deletePermission(id);
    return id;
  }
);

export const assignRolesToUser = createAsyncThunk(
  'rbac/assignRolesToUser',
  async ({ userId, roleIds }: { userId: number; roleIds: number[] }) => {
    await rbacApi.assignRolesToUser(userId, roleIds);
    return { userId, roleIds };
  }
);

export const checkUserPermission = createAsyncThunk(
  'rbac/checkUserPermission',
  async ({ userId, permission }: { userId: number; permission: string }) => {
    return await rbacApi.checkUserPermission(userId, permission);
  }
);

const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    setSelectedPermission: (state, action: PayloadAction<Permission | null>) => {
      state.selectedPermission = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetch roles response:', action.payload);
        state.roles = (action.payload as any).data || action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch roles';
      });

    // Fetch permissions
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetch permissions response:', action.payload);
        state.permissions = (action.payload as any).data || action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permissions';
      });

    // Fetch audit logs
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetch audit logs response:', action.payload);
        state.auditLogs = (action.payload as any).data || action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch audit logs';
      });

    // Fetch modules
    builder
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetch modules response:', action.payload);
        state.modules = (action.payload as any).data || action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch modules';
      });

    // Create role
    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create role';
      });

    // Update role
    builder
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex((role: any) => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update role';
      });

    // Delete role
    builder
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role: any) => role.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete role';
      });

    // Create permission
    builder
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.loading = false;
        const module = action.payload.module;
        if (!state.permissions[module]) {
          state.permissions[module] = [];
        }
        state.permissions[module].push(action.payload);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create permission';
      });

    // Update permission
    builder
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const module = action.payload.module;
        if (state.permissions[module]) {
          const index = state.permissions[module].findIndex((perm: any) => perm.id === action.payload.id);
          if (index !== -1) {
            state.permissions[module][index] = action.payload;
          }
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update permission';
      });

    // Delete permission
    builder
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(state.permissions).forEach(module => {
          state.permissions[module] = state.permissions[module].filter((perm: any)  => perm.id !== action.payload);
        });
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete permission';
      });
  },
});

export const { setSelectedRole, setSelectedPermission, clearError } = rbacSlice.actions;
export default rbacSlice.reducer; 