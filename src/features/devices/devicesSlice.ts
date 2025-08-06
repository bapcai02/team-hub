import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import devicesApi from './api';
import { Device, DeviceStats, CreateDeviceRequest, UpdateDeviceRequest, DeviceCategory, CreateDeviceCategoryRequest, UpdateDeviceCategoryRequest } from './types';

export interface DevicesState {
  devices: Device[];
  categories: DeviceCategory[];
  selectedDevice: Device | null;
  stats: DeviceStats | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    type?: string;
    status?: string;
    department?: string;
  };
}

const initialState: DevicesState = {
  devices: [],
  categories: [],
  selectedDevice: null,
  stats: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {},
};

// Async thunks
export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (params: any = undefined, { rejectWithValue }) => {
    try {
      const response = await devicesApi.getDevices(params);
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch devices');
    }
  }
);

export const fetchDevice = createAsyncThunk(
  'devices/fetchDevice',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await devicesApi.getDevice(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch device');
    }
  }
);

export const createDevice = createAsyncThunk(
  'devices/createDevice',
  async (data: CreateDeviceRequest, { rejectWithValue }) => {
    try {
      const response = await devicesApi.createDevice(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create device');
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, ...data }: { id: number } & UpdateDeviceRequest, { rejectWithValue }) => {
    try {
      const response = await devicesApi.updateDevice(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update device');
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (id: number, { rejectWithValue }) => {
    try {
      await devicesApi.deleteDevice(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete device');
    }
  }
);

export const fetchDeviceStats = createAsyncThunk(
  'devices/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await devicesApi.getStats();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch device stats');
    }
  }
);

export const searchDevices = createAsyncThunk(
  'devices/searchDevices',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await devicesApi.searchDevices(query);
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search devices');
    }
  }
);

export const assignDevice = createAsyncThunk(
  'devices/assignDevice',
  async ({ deviceId, userId }: { deviceId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await devicesApi.assignDevice(deviceId, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign device');
    }
  }
);

export const unassignDevice = createAsyncThunk(
  'devices/unassignDevice',
  async (deviceId: number, { rejectWithValue }) => {
    try {
      const response = await devicesApi.unassignDevice(deviceId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unassign device');
    }
  }
);

// Device Category Async thunks
export const fetchDeviceCategories = createAsyncThunk(
  'devices/fetchDeviceCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await devicesApi.getCategories();
      return response?.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch device categories');
    }
  }
);

export const createDeviceCategory = createAsyncThunk(
  'devices/createDeviceCategory',
  async (data: CreateDeviceCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await devicesApi.createCategory(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create device category');
    }
  }
);

export const updateDeviceCategory = createAsyncThunk(
  'devices/updateDeviceCategory',
  async ({ id, ...data }: { id: number } & UpdateDeviceCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await devicesApi.updateCategory(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update device category');
    }
  }
);

export const deleteDeviceCategory = createAsyncThunk(
  'devices/deleteDeviceCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await devicesApi.deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete device category');
    }
  }
);

export const searchDeviceCategories = createAsyncThunk(
  'devices/searchDeviceCategories',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await devicesApi.getCategories();
      const categories = response.data.data || [];
      return categories.filter((category: DeviceCategory) => 
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.code.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search device categories');
    }
  }
);

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setSelectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.selectedDevice = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DevicesState['filters']>>) => {
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
    // Fetch devices
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload || [];
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single device
    builder
      .addCase(fetchDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDevice = action.payload;
      })
      .addCase(fetchDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create device
    builder
      .addCase(createDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.devices) {
          state.devices = [];
        }
        state.devices.unshift(action.payload);
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update device
    builder
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        if (state.devices) {
          const index = state.devices.findIndex(device => device.id === action.payload.id);
          if (index !== -1) {
            state.devices[index] = action.payload;
          }
        }
        if (state.selectedDevice?.id === action.payload.id) {
          state.selectedDevice = action.payload;
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete device
    builder
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        if (state.devices) {
          state.devices = state.devices.filter(device => device.id !== action.payload);
        }
        if (state.selectedDevice?.id === action.payload) {
          state.selectedDevice = null;
        }
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch stats
    builder
      .addCase(fetchDeviceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDeviceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search devices
    builder
      .addCase(searchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload || [];
      })
      .addCase(searchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assign device
    builder
      .addCase(assignDevice.fulfilled, (state, action) => {
        if (state.devices) {
          const index = state.devices.findIndex(device => device.id === action.payload.id);
          if (index !== -1) {
            state.devices[index] = action.payload;
          }
        }
        if (state.selectedDevice?.id === action.payload.id) {
          state.selectedDevice = action.payload;
        }
      });

    // Unassign device
    builder
      .addCase(unassignDevice.fulfilled, (state, action) => {
        if (state.devices) {
          const index = state.devices.findIndex(device => device.id === action.payload.id);
          if (index !== -1) {
            state.devices[index] = action.payload;
          }
        }
        if (state.selectedDevice?.id === action.payload.id) {
          state.selectedDevice = action.payload;
        }
      });

    // Fetch device categories
    builder
      .addCase(fetchDeviceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchDeviceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create device category
    builder
      .addCase(createDeviceCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeviceCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.categories) {
          state.categories = [];
        }
        state.categories.unshift(action.payload);
      })
      .addCase(createDeviceCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update device category
    builder
      .addCase(updateDeviceCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeviceCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (state.categories) {
          const index = state.categories.findIndex(category => category.id === action.payload.id);
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        }
      })
      .addCase(updateDeviceCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete device category
    builder
      .addCase(deleteDeviceCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeviceCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (state.categories) {
          state.categories = state.categories.filter(category => category.id !== action.payload);
        }
      })
      .addCase(deleteDeviceCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search device categories
    builder
      .addCase(searchDeviceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDeviceCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(searchDeviceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedDevice,
  setSearchQuery,
  setFilters,
  clearFilters,
  clearError,
} = devicesSlice.actions;

export default devicesSlice.reducer; 