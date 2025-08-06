export interface Attendance {
  id: number;
  employee_id: number;
  employee: {
    id: number;
    full_name: string;
    employee_code: string;
    department: string;
    position: string;
  };
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  total_hours: number;
  overtime_hours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes: string | null;
  location: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  leave: number;
  average_hours: number;
  total_overtime: number;
}

export interface CreateAttendanceRequest {
  employee_id: number;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  break_start_time?: string;
  break_end_time?: string;
  total_hours?: number;
  overtime_hours?: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string;
  location?: string;
  ip_address?: string;
}

export interface UpdateAttendanceRequest {
  employee_id?: number;
  date?: string;
  check_in_time?: string;
  check_out_time?: string;
  break_start_time?: string;
  break_end_time?: string;
  total_hours?: number;
  overtime_hours?: number;
  status?: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string;
  location?: string;
  ip_address?: string;
}

export interface AttendanceFilters {
  search?: string;
  status?: string;
  department?: string;
  date_range?: [string, string];
  employee_id?: number;
} 