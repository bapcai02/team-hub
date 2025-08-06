import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import attendanceApi from './api';
import { Attendance, AttendanceStats, CreateAttendanceRequest, UpdateAttendanceRequest, AttendanceFilters } from './types';

export interface AttendanceState {
  attendances: Attendance[];
  selectedAttendance: Attendance | null;
  stats: AttendanceStats | null;
  loading: boolean;
  error: string | null;
  filters: AttendanceFilters;
}

const initialState: AttendanceState = {
  attendances: [],
  selectedAttendance: null,
  stats: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchAttendances = createAsyncThunk(
  'attendance/fetchAttendances',
  async (params: AttendanceFilters | undefined = undefined, { rejectWithValue }) => {
          try {
        const response = await attendanceApi.getAttendances(params);
        return response.data.data.attendances.data || [];
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendances');
      }
  }
);

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAttendance(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const createAttendance = createAsyncThunk(
  'attendance/createAttendance',
  async (data: CreateAttendanceRequest, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.createAttendance(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create attendance');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ id, ...data }: { id: number } & UpdateAttendanceRequest, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.updateAttendance(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update attendance');
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/deleteAttendance',
  async (id: number, { rejectWithValue }) => {
    try {
      await attendanceApi.deleteAttendance(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete attendance');
    }
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchStats',
  async (arg: void, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getStats();
      return response.data.data.stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance stats');
    }
  }
);

export const searchAttendances = createAsyncThunk(
  'attendance/searchAttendances',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.searchAttendances(query);
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search attendances');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setSelectedAttendance: (state, action: PayloadAction<Attendance | null>) => {
      state.selectedAttendance = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AttendanceFilters>>) => {
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
    // Fetch attendances
    builder
      .addCase(fetchAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload || [];
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single attendance
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAttendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create attendance
    builder
      .addCase(createAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.attendances) {
          state.attendances = [];
        }
        state.attendances.unshift(action.payload);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update attendance
    builder
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        if (state.attendances) {
          const index = state.attendances.findIndex(attendance => attendance.id === action.payload.id);
          if (index !== -1) {
            state.attendances[index] = action.payload;
          }
        }
        if (state.selectedAttendance?.id === action.payload.id) {
          state.selectedAttendance = action.payload;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete attendance
    builder
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        if (state.attendances) {
          state.attendances = state.attendances.filter(attendance => attendance.id !== action.payload);
        }
        if (state.selectedAttendance?.id === action.payload) {
          state.selectedAttendance = null;
        }
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch stats
    builder
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search attendances
    builder
      .addCase(searchAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload || [];
      })
      .addCase(searchAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedAttendance,
  setFilters,
  clearFilters,
  clearError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer; 