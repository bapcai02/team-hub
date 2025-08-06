import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { analyticsApi } from './api';
import {
  AnalyticsData,
  AnalyticsFilters,
  EmployeePerformanceData,
  FinancialData,
  ProjectData,
  AttendanceData,
  CustomReport,
  TrendAnalysisRequest,
  ExportRequest
} from './types';

export interface AnalyticsState {
  analyticsData: AnalyticsData | null;
  employeeAnalytics: EmployeePerformanceData | null;
  financialAnalytics: FinancialData | null;
  projectAnalytics: ProjectData | null;
  attendanceAnalytics: AttendanceData | null;
  kpiMetrics: any;
  trendAnalysis: any;
  customReport: CustomReport | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
}

const initialState: AnalyticsState = {
  analyticsData: null,
  employeeAnalytics: null,
  financialAnalytics: null,
  projectAnalytics: null,
  attendanceAnalytics: null,
  kpiMetrics: null,
  trendAnalysis: null,
  customReport: null,
  loading: false,
  error: null,
  filters: {}
};

// Async thunks
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (filters: AnalyticsFilters = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAnalytics(filters);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchEmployeeAnalytics = createAsyncThunk(
  'analytics/fetchEmployeeAnalytics',
  async (filters: AnalyticsFilters = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getEmployeeAnalytics(filters);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee analytics');
    }
  }
);

export const fetchFinancialAnalytics = createAsyncThunk(
  'analytics/fetchFinancialAnalytics',
  async (filters: AnalyticsFilters = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getFinancialAnalytics(filters);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch financial analytics');
    }
  }
);

export const fetchProjectAnalytics = createAsyncThunk(
  'analytics/fetchProjectAnalytics',
  async (filters: AnalyticsFilters = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getProjectAnalytics(filters);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project analytics');
    }
  }
);

export const fetchAttendanceAnalytics = createAsyncThunk(
  'analytics/fetchAttendanceAnalytics',
  async (filters: AnalyticsFilters = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getAttendanceAnalytics(filters);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance analytics');
    }
  }
);

export const fetchKPIMetrics = createAsyncThunk(
  'analytics/fetchKPIMetrics',
  async (period: string = 'month', { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getKPIMetrics(period);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch KPI metrics');
    }
  }
);

export const fetchTrendAnalysis = createAsyncThunk(
  'analytics/fetchTrendAnalysis',
  async (request: TrendAnalysisRequest, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getTrendAnalysis(request);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trend analysis');
    }
  }
);

export const fetchCustomReport = createAsyncThunk(
  'analytics/fetchCustomReport',
  async ({ reportType, filters }: { reportType: string; filters: AnalyticsFilters }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getCustomReport(reportType, filters);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch custom report');
    }
  }
);

export const exportAnalyticsReport = createAsyncThunk(
  'analytics/exportAnalyticsReport',
  async (request: ExportRequest, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.exportReport(request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export analytics report');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<AnalyticsFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.analyticsData = null;
      state.employeeAnalytics = null;
      state.financialAnalytics = null;
      state.projectAnalytics = null;
      state.attendanceAnalytics = null;
      state.kpiMetrics = null;
      state.trendAnalysis = null;
      state.customReport = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Employee Analytics
    builder
      .addCase(fetchEmployeeAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAnalytics = action.payload;
      })
      .addCase(fetchEmployeeAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Financial Analytics
    builder
      .addCase(fetchFinancialAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.financialAnalytics = action.payload;
      })
      .addCase(fetchFinancialAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Project Analytics
    builder
      .addCase(fetchProjectAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.projectAnalytics = action.payload;
      })
      .addCase(fetchProjectAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Attendance Analytics
    builder
      .addCase(fetchAttendanceAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceAnalytics = action.payload;
      })
      .addCase(fetchAttendanceAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch KPI Metrics
    builder
      .addCase(fetchKPIMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKPIMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.kpiMetrics = action.payload;
      })
      .addCase(fetchKPIMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Trend Analysis
    builder
      .addCase(fetchTrendAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.trendAnalysis = action.payload;
      })
      .addCase(fetchTrendAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Custom Report
    builder
      .addCase(fetchCustomReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomReport.fulfilled, (state, action) => {
        state.loading = false;
        state.customReport = action.payload;
      })
      .addCase(fetchCustomReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Export Analytics Report
    builder
      .addCase(exportAnalyticsReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportAnalyticsReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportAnalyticsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setFilters, clearFilters, clearError, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer; 