import { api } from '../../utils/api';
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

export const analyticsApi = {
  // Get comprehensive analytics data
  getAnalytics: (filters: AnalyticsFilters = {}) =>
    api.get<{ data: AnalyticsData }>('/analytics', { params: filters }),

  // Get employee analytics
  getEmployeeAnalytics: (filters: AnalyticsFilters = {}) =>
    api.get<{ data: EmployeePerformanceData }>('/analytics/employee', { params: filters }),

  // Get financial analytics
  getFinancialAnalytics: (filters: AnalyticsFilters = {}) =>
    api.get<{ data: FinancialData }>('/analytics/financial', { params: filters }),

  // Get project analytics
  getProjectAnalytics: (filters: AnalyticsFilters = {}) =>
    api.get<{ data: ProjectData }>('/analytics/project', { params: filters }),

  // Get attendance analytics
  getAttendanceAnalytics: (filters: AnalyticsFilters = {}) =>
    api.get<{ data: AttendanceData }>('/analytics/attendance', { params: filters }),

  // Get KPI metrics
  getKPIMetrics: (period: string = 'month') =>
    api.get<{ data: any }>('/analytics/kpi', { params: { period } }),

  // Get trend analysis
  getTrendAnalysis: (request: TrendAnalysisRequest) =>
    api.get<{ data: any }>('/analytics/trends', { params: request }),

  // Get custom report
  getCustomReport: (reportType: string, filters: AnalyticsFilters = {}) =>
    api.get<{ data: CustomReport }>('/analytics/reports', { 
      params: { report_type: reportType, ...filters } 
    }),

  // Export analytics report
  exportReport: (request: ExportRequest) =>
    api.get('/analytics/export', { 
      params: request,
      responseType: 'blob'
    })
}; 