export interface AnalyticsData {
  overview: OverviewMetrics;
  employee_analytics: EmployeeAnalytics;
  financial_analytics: FinancialAnalytics;
  project_analytics: ProjectAnalytics;
  attendance_analytics: AttendanceAnalytics;
  trends: TrendAnalysis;
  kpis: KPIMetrics;
}

export interface OverviewMetrics {
  total_employees: number;
  active_projects: number;
  total_expenses: number;
  attendance_rate: number;
  project_completion_rate: number;
  revenue_growth: number;
}

export interface EmployeeAnalytics {
  performance_distribution: PerformanceDistribution;
  skill_gaps: SkillGaps;
  turnover_rate: number;
  productivity_trends: ChartData;
}

export interface PerformanceDistribution {
  excellent: number;
  good: number;
  average: number;
  below_average: number;
}

export interface SkillGaps {
  technical_skills: string[];
  soft_skills: string[];
  certifications: string[];
}

export interface FinancialAnalytics {
  revenue_trends: ChartData;
  expense_categories: Record<string, number>;
  profit_margins: number;
  cash_flow_analysis: CashFlowAnalysis;
}

export interface CashFlowAnalysis {
  operating_cash_flow: number;
  investing_cash_flow: number;
  financing_cash_flow: number;
  net_cash_flow: number;
}

export interface ProjectAnalytics {
  project_status_distribution: ProjectStatusDistribution;
  resource_utilization: ResourceUtilization;
  timeline_performance: TimelinePerformance;
  cost_variance: CostVariance;
}

export interface ProjectStatusDistribution {
  active: number;
  completed: number;
  on_hold: number;
  cancelled: number;
}

export interface ResourceUtilization {
  utilization_rate: number;
  overallocation: number;
  underallocation: number;
}

export interface TimelinePerformance {
  on_time: number;
  delayed: number;
  ahead_of_schedule: number;
}

export interface CostVariance {
  under_budget: number;
  on_budget: number;
  over_budget: number;
}

export interface AttendanceAnalytics {
  attendance_trends: ChartData;
  overtime_analysis: OvertimeAnalysis;
  department_comparison: Record<string, number>;
  attendance_patterns: AttendancePatterns;
}

export interface OvertimeAnalysis {
  total_overtime_hours: number;
  average_overtime_per_employee: number;
  overtime_cost: number;
}

export interface AttendancePatterns {
  early_arrivals: number;
  on_time: number;
  late_arrivals: number;
}

export interface TrendAnalysis {
  employee_growth: ChartData;
  revenue_growth: ChartData;
  project_completion: ChartData;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface KPIMetrics {
  employee_kpis: EmployeeKPIs;
  financial_kpis: FinancialKPIs;
  project_kpis: ProjectKPIs;
  operational_kpis: OperationalKPIs;
}

export interface EmployeeKPIs {
  employee_satisfaction: number;
  turnover_rate: number;
  training_completion: number;
  performance_average: number;
}

export interface FinancialKPIs {
  revenue_growth: number;
  profit_margin: number;
  expense_ratio: number;
  cash_flow_ratio: number;
}

export interface ProjectKPIs {
  project_completion_rate: number;
  on_time_delivery: number;
  budget_adherence: number;
  customer_satisfaction: number;
}

export interface OperationalKPIs {
  attendance_rate: number;
  productivity_index: number;
  resource_utilization: number;
  quality_score: number;
}

export interface AnalyticsFilters {
  period?: string;
  start_date?: string;
  end_date?: string;
  employee_id?: number;
  department_id?: number;
  project_id?: number;
}

export interface EmployeePerformanceData {
  employee_id: number;
  name: string;
  department: string;
  attendance_rate: number;
  total_hours: number;
  overtime_hours: number;
}

export interface FinancialData {
  expenses: {
    total: number;
    by_category: Record<string, number>;
    monthly_trend: Record<string, number>;
  };
  payroll: {
    total: number;
    count: number;
  };
  summary: {
    total_expenses: number;
    total_payroll: number;
    net_outflow: number;
  };
}

export interface ProjectData {
  projects: {
    total: number;
    by_status: Record<string, number>;
    monthly_trend: Record<string, number>;
  };
  summary: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    delayed_projects: number;
  };
}

export interface AttendanceData {
  attendance: {
    total_records: number;
    daily_data: Record<string, DailyAttendance>;
    by_department: Record<string, DepartmentAttendance>;
  };
  summary: {
    total_days: number;
    average_attendance_rate: number;
    total_overtime_hours: number;
    total_late_arrivals: number;
  };
}

export interface DailyAttendance {
  total: number;
  present: number;
  absent: number;
  late: number;
}

export interface DepartmentAttendance {
  total: number;
  present: number;
  rate: number;
}

export interface CustomReport {
  summary: Record<string, any>;
  details: Record<string, any>;
  recommendations?: Record<string, any>;
  projections?: Record<string, any>;
  risks?: Record<string, any>;
  trends?: Record<string, any>;
  categories?: Record<string, any>;
}

export interface TrendAnalysisRequest {
  metric: string;
  period: string;
}

export interface ExportRequest {
  report_type: string;
  format: string;
  filters: AnalyticsFilters;
} 