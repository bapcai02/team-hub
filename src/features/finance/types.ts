// Payroll Types
export interface Payroll {
  id: number;
  code: string;
  employee_id: number;
  employee?: Employee;
  pay_period_start: string;
  pay_period_end: string;
  basic_salary: number;
  gross_salary: number;
  net_salary: number;
  total_allowances: number;
  total_deductions: number;
  overtime_pay: number;
  bonus: number;
  tax_amount: number;
  insurance_amount: number;
  working_days: number;
  overtime_hours: number;
  status: 'draft' | 'approved' | 'paid' | 'cancelled';
  payment_date?: string;
  approved_by?: number;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: PayrollItem[];
}

export interface PayrollItem {
  id: number;
  payroll_id: number;
  salary_component_id?: number;
  component_name: string;
  type: 'allowance' | 'deduction' | 'bonus' | 'overtime';
  amount: number;
  rate: number;
  quantity: number;
  description?: string;
  is_taxable: boolean;
  created_at: string;
  updated_at: string;
  salary_component?: SalaryComponent;
}

export interface CreatePayrollRequest {
  employee_id: number;
  pay_period_start: string;
  pay_period_end: string;
  basic_salary: number;
  working_days: number;
  overtime_hours?: number;
  bonus?: number;
  notes?: string;
}

export interface UpdatePayrollRequest {
  basic_salary?: number;
  working_days?: number;
  overtime_hours?: number;
  bonus?: number;
  notes?: string;
}

export interface GeneratePayrollRequest {
  employee_ids: number[];
  pay_period_start: string;
  pay_period_end: string;
}

// Expense Types
export interface Expense {
  id: number;
  code: string;
  title: string;
  description?: string;
  amount: number;
  type: 'operational' | 'administrative' | 'marketing' | 'travel' | 'utilities' | 'maintenance' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  expense_date: string;
  due_date?: string;
  employee_id: number;
  employee?: Employee;
  department_id?: number;
  department?: Department;
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  receipt_file?: string;
  attachments?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  type: 'operational' | 'administrative' | 'marketing' | 'travel' | 'utilities' | 'maintenance' | 'other';
  expense_date: string;
  due_date?: string;
  employee_id: number;
  department_id?: number;
  receipt_file?: string;
  attachments?: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  description?: string;
  amount?: number;
  type?: 'operational' | 'administrative' | 'marketing' | 'travel' | 'utilities' | 'maintenance' | 'other';
  expense_date?: string;
  due_date?: string;
  department_id?: number;
  receipt_file?: string;
  attachments?: string;
}

export interface RejectExpenseRequest {
  rejection_reason: string;
}

// Salary Component Types
export interface SalaryComponent {
  id: number;
  name: string;
  code: string;
  type: 'allowance' | 'deduction' | 'bonus' | 'overtime';
  calculation_type: 'fixed' | 'percentage' | 'formula';
  amount?: number;
  percentage?: number;
  formula?: string;
  is_taxable: boolean;
  is_active: boolean;
  description?: string;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSalaryComponentRequest {
  name: string;
  code: string;
  type: 'allowance' | 'deduction' | 'bonus' | 'overtime';
  calculation_type: 'fixed' | 'percentage' | 'formula';
  amount?: number;
  percentage?: number;
  formula?: string;
  is_taxable?: boolean;
  is_active?: boolean;
  description?: string;
  sort_order?: number;
}

export interface UpdateSalaryComponentRequest {
  name?: string;
  code?: string;
  type?: 'allowance' | 'deduction' | 'bonus' | 'overtime';
  calculation_type?: 'fixed' | 'percentage' | 'formula';
  amount?: number;
  percentage?: number;
  formula?: string;
  is_taxable?: boolean;
  is_active?: boolean;
  description?: string;
  sort_order?: number;
}

// Statistics Types
export interface PayrollStats {
  total_payrolls: number;
  total_amount: number;
  pending_amount: number;
  approved_amount: number;
  paid_amount: number;
  payrolls_by_status: Array<{ status: string; count: number; total_amount: number }>;
  monthly_payrolls: Array<{ year: number; month: number; total_amount: number }>;
}

export interface ExpenseStats {
  total_expenses: number;
  total_amount: number;
  pending_amount: number;
  approved_amount: number;
  paid_amount: number;
  expenses_by_type: Array<{ type: string; count: number; total_amount: number }>;
  expenses_by_status: Array<{ status: string; count: number; total_amount: number }>;
  monthly_expenses: Array<{ year: number; month: number; total_amount: number }>;
}

// Helper Types
export interface Employee {
  id: number;
  name: string;
  email: string;
  position?: string;
  department?: Department;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

// Pagination Types
export interface PaginationMeta {
  current_page: number;
  data: any[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: PaginationMeta & { data: T[] };
} 