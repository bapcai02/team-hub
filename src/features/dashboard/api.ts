import api from '../../services/axios';
import { DashboardData, ChartRequest, Activity } from './types';

const dashboardApi = {
  // Get dashboard data
  getDashboardData: () => 
    api.get<{ data: { dashboard: DashboardData } }>('/dashboard'),

  // Get recent activities
  getRecentActivities: (limit?: number) => 
    api.get<{ data: { activities: Activity[] } }>('/dashboard/activities', { 
      params: { limit } 
    }),

  // Get chart data
  getChartData: (params: ChartRequest) => 
    api.get<{ data: { chart: any } }>('/dashboard/charts', { params }),
};

export default dashboardApi; 