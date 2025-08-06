export interface DashboardData {
  overview: OverviewStats;
  attendance: AttendanceStats;
  employees: EmployeeStats;
  projects: ProjectStats;
  finance: FinanceStats;
  recent_activities: Activity[];
  charts: ChartData;
}

export interface OverviewStats {
  total_employees: number;
  active_projects: number;
  total_expenses: number;
  total_payroll: number;
  attendance_rate: number;
  project_completion_rate: number;
}

export interface AttendanceStats {
  today: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  this_month: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  attendance_rate: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  new_this_month: number;
  by_department: DepartmentStats[];
}

export interface DepartmentStats {
  department: string;
  count: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
  completion_rate: number;
}

export interface FinanceStats {
  total_expenses: number;
  total_payroll: number;
  monthly_expenses: number;
  monthly_payroll: number;
  total_budget: number;
}

export interface Activity {
  type: 'attendance' | 'employee' | 'expense' | 'project';
  title: string;
  description: string;
  time: string;
  user: string;
  icon: string;
}

export interface ChartData {
  attendance_trend: ChartDataset;
  department_stats: ChartDataset;
  expense_by_category: ChartDataset;
  project_progress: ChartDataset;
}

export interface ChartDataset {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
  }[];
}

export interface ChartRequest {
  type: 'attendance' | 'expenses' | 'projects' | 'employees';
  period: 'week' | 'month' | 'quarter' | 'year';
} 