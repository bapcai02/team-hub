import api from '../../services/axios';
import { 
  Attendance, 
  AttendanceStats, 
  CreateAttendanceRequest, 
  UpdateAttendanceRequest,
  AttendanceFilters
} from './types';

const attendanceApi = {
  // Get all attendances
  getAttendances: (params?: AttendanceFilters) => 
    api.get<{ data: { attendances: { data: Attendance[], total: number, filters: any } } }>('/attendances', { params }),

  // Get attendance by ID
  getAttendance: (id: number) => 
    api.get<{ data: Attendance }>(`/attendances/${id}`),

  // Create new attendance
  createAttendance: (data: CreateAttendanceRequest) => 
    api.post<{ data: Attendance }>('/attendances', data),

  // Update attendance
  updateAttendance: (id: number, data: UpdateAttendanceRequest) => 
    api.put<{ data: Attendance }>(`/attendances/${id}`, data),

  // Delete attendance
  deleteAttendance: (id: number) => 
    api.delete(`/attendances/${id}`),

  // Get attendance statistics
  getStats: () => 
    api.get<{ data: { stats: AttendanceStats } }>('/attendances/stats'),

  // Search attendances
  searchAttendances: (query: string) => 
    api.get<{ data: Attendance[] }>('/attendances/search', { params: { q: query } }),

  // Get attendances by employee
  getAttendancesByEmployee: (employeeId: number, params?: any) => 
    api.get<{ data: Attendance[] }>(`/employees/${employeeId}/attendances`, { params }),

  // Get attendances by date range
  getAttendancesByDateRange: (startDate: string, endDate: string, params?: any) => 
    api.get<{ data: Attendance[] }>('/attendances/by-date-range', { 
      params: { start_date: startDate, end_date: endDate, ...params } 
    }),
};

export default attendanceApi; 