import api from '../../services/axios';
import {
  Payroll,
  CreatePayrollRequest,
  UpdatePayrollRequest,
  GeneratePayrollRequest,
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  RejectExpenseRequest,
  SalaryComponent,
  CreateSalaryComponentRequest,
  UpdateSalaryComponentRequest,
  PayrollStats,
  ExpenseStats,
} from './types';

// Payroll API
export const payrollApi = {
  // Get all payrolls
  getAll: (params?: any) => api.get<{ data: Payroll[] }>('/payroll', { params }),
  
  // Get payroll by ID
  getById: (id: number) => api.get<{ data: Payroll }>(`/payroll/${id}`),
  
  // Create new payroll
  create: (data: CreatePayrollRequest) => api.post<{ data: Payroll }>('/payroll', data),
  
  // Update payroll
  update: (id: number, data: UpdatePayrollRequest) => api.put<{ data: Payroll }>(`/payroll/${id}`, data),
  
  // Delete payroll
  delete: (id: number) => api.delete(`/payroll/${id}`),
  
  // Approve payroll
  approve: (id: number) => api.post<{ data: Payroll }>(`/payroll/${id}/approve`),
  
  // Mark payroll as paid
  markAsPaid: (id: number) => api.post<{ data: Payroll }>(`/payroll/${id}/mark-as-paid`),
  
  // Generate payrolls
  generate: (data: GeneratePayrollRequest) => api.post<{ data: Payroll[] }>('/payroll/generate', data),
};

// Expense API
export const expenseApi = {
  // Get all expenses
  getAll: (params?: any) => api.get<{ data: Expense[] }>('/expenses', { params }),
  
  // Get expense by ID
  getById: (id: number) => api.get<{ data: Expense }>(`/expenses/${id}`),
  
  // Create new expense
  create: (data: CreateExpenseRequest) => api.post<{ data: Expense }>('/expenses', data),
  
  // Update expense
  update: (id: number, data: UpdateExpenseRequest) => api.put<{ data: Expense }>(`/expenses/${id}`, data),
  
  // Delete expense
  delete: (id: number) => api.delete(`/expenses/${id}`),
  
  // Approve expense
  approve: (id: number) => api.post<{ data: Expense }>(`/expenses/${id}/approve`),
  
  // Reject expense
  reject: (id: number, data: RejectExpenseRequest) => api.post<{ data: Expense }>(`/expenses/${id}/reject`, data),
  
  // Mark expense as paid
  markAsPaid: (id: number) => api.post<{ data: Expense }>(`/expenses/${id}/mark-as-paid`),
  
  // Get expense statistics
  getStatistics: (params?: any) => api.get<{ data: ExpenseStats }>('/expenses/statistics', { params }),
};

// Salary Component API
export const salaryComponentApi = {
  // Get all salary components
  getAll: (params?: any) => api.get<{ data: SalaryComponent[] }>('/salary-components', { params }),
  
  // Get salary component by ID
  getById: (id: number) => api.get<{ data: SalaryComponent }>(`/salary-components/${id}`),
  
  // Create new salary component
  create: (data: CreateSalaryComponentRequest) => api.post<{ data: SalaryComponent }>('/salary-components', data),
  
  // Update salary component
  update: (id: number, data: UpdateSalaryComponentRequest) => api.put<{ data: SalaryComponent }>(`/salary-components/${id}`, data),
  
  // Delete salary component
  delete: (id: number) => api.delete(`/salary-components/${id}`),
  
  // Get salary components by type
  getByType: (type: string) => api.get<{ data: SalaryComponent[] }>(`/salary-components/type/${type}`),
  
  // Toggle salary component active status
  toggleActive: (id: number) => api.post<{ data: SalaryComponent }>(`/salary-components/${id}/toggle-active`),
}; 