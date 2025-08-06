import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import dashboardApi from './api';
import { DashboardData, Activity } from './types';

export interface DashboardState {
  dashboardData: DashboardData | null;
  recentActivities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  dashboardData: null,
  recentActivities: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getDashboardData();
      return response.data.data.dashboard;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit: number | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getRecentActivities(limit);
      return response.data.data.activities;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent activities');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch recent activities
    builder
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 