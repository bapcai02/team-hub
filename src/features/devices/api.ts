import api from '../../services/axios';
import { 
  Device, 
  DeviceStats, 
  CreateDeviceRequest, 
  UpdateDeviceRequest,
  DeviceCategory,
  CreateDeviceCategoryRequest,
  UpdateDeviceCategoryRequest
} from './types';

const devicesApi = {
  // Get all devices
  getDevices: (params?: any) => 
    api.get('/devices', { params }),

  // Get device by ID
  getDevice: (id: number) => 
    api.get(`/devices/${id}`),

  // Create new device
  createDevice: (data: CreateDeviceRequest) => 
    api.post('/devices', data),

  // Update device
  updateDevice: (id: number, data: UpdateDeviceRequest) => 
    api.put(`/devices/${id}`, data),

  // Delete device
  deleteDevice: (id: number) => 
    api.delete(`/devices/${id}`),

  // Get device statistics
  getStats: () => 
    api.get('/devices/stats'),

  // Search devices
  searchDevices: (query: string) => 
    api.get('/devices/search', { params: { q: query } }),

  // Assign device to user
  assignDevice: (deviceId: number, userId: number) => 
    api.post(`/devices/${deviceId}/assign`, { user_id: userId }),

  // Unassign device
  unassignDevice: (deviceId: number) => 
    api.post(`/devices/${deviceId}/unassign`),

  // Get device history
  getDeviceHistory: (deviceId: number) => 
    api.get(`/devices/${deviceId}/history`),

  // Device Categories
  getCategories: () => 
    api.get<DeviceCategory[]>('/device-categories'),

  getCategory: (id: number) => 
    api.get<DeviceCategory>(`/device-categories/${id}`),

  createCategory: (data: CreateDeviceCategoryRequest) => 
    api.post<DeviceCategory>('/device-categories', data),

  updateCategory: (id: number, data: UpdateDeviceCategoryRequest) => 
    api.put<DeviceCategory>(`/device-categories/${id}`, data),

  deleteCategory: (id: number) => 
    api.delete(`/device-categories/${id}`),
};

export default devicesApi; 