import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { payrollApi, expenseApi, salaryComponentApi } from './api';
import {
  Payroll,
  Expense,
  SalaryComponent,
  CreatePayrollRequest,
  UpdatePayrollRequest,
  GeneratePayrollRequest,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  RejectExpenseRequest,
  CreateSalaryComponentRequest,
  UpdateSalaryComponentRequest,
  PayrollStats,
  ExpenseStats,
} from './types';

// Payroll Async Thunks
export const fetchPayrolls = createAsyncThunk(
  'finance/fetchPayrolls',
  async (params?: any) => {
    const response = await payrollApi.getAll(params);
    return response.data;
  }
);

export const fetchPayrollById = createAsyncThunk(
  'finance/fetchPayrollById',
  async (id: number) => {
    const response = await payrollApi.getById(id);
    return response.data;
  }
);

export const createPayroll = createAsyncThunk(
  'finance/createPayroll',
  async (data: CreatePayrollRequest) => {
    const response = await payrollApi.create(data);
    return response.data;
  }
);

export const updatePayroll = createAsyncThunk(
  'finance/updatePayroll',
  async ({ id, data }: { id: number; data: UpdatePayrollRequest }) => {
    const response = await payrollApi.update(id, data);
    return response.data;
  }
);

export const deletePayroll = createAsyncThunk(
  'finance/deletePayroll',
  async (id: number) => {
    await payrollApi.delete(id);
    return id;
  }
);

export const approvePayroll = createAsyncThunk(
  'finance/approvePayroll',
  async (id: number) => {
    const response = await payrollApi.approve(id);
    return response.data;
  }
);

export const markPayrollAsPaid = createAsyncThunk(
  'finance/markPayrollAsPaid',
  async (id: number) => {
    const response = await payrollApi.markAsPaid(id);
    return response.data;
  }
);

export const generatePayrolls = createAsyncThunk(
  'finance/generatePayrolls',
  async (data: GeneratePayrollRequest) => {
    const response = await payrollApi.generate(data);
    return response.data;
  }
);

// Expense Async Thunks
export const fetchExpenses = createAsyncThunk(
  'finance/fetchExpenses',
  async (params?: any) => {
    const response = await expenseApi.getAll(params);
    return response.data;
  }
);

export const fetchExpenseById = createAsyncThunk(
  'finance/fetchExpenseById',
  async (id: number) => {
    const response = await expenseApi.getById(id);
    return response.data;
  }
);

export const createExpense = createAsyncThunk(
  'finance/createExpense',
  async (data: CreateExpenseRequest) => {
    const response = await expenseApi.create(data);
    return response.data;
  }
);

export const updateExpense = createAsyncThunk(
  'finance/updateExpense',
  async ({ id, data }: { id: number; data: UpdateExpenseRequest }) => {
    const response = await expenseApi.update(id, data);
    return response.data;
  }
);

export const deleteExpense = createAsyncThunk(
  'finance/deleteExpense',
  async (id: number) => {
    await expenseApi.delete(id);
    return id;
  }
);

export const approveExpense = createAsyncThunk(
  'finance/approveExpense',
  async (id: number) => {
    const response = await expenseApi.approve(id);
    return response.data;
  }
);

export const rejectExpense = createAsyncThunk(
  'finance/rejectExpense',
  async ({ id, data }: { id: number; data: RejectExpenseRequest }) => {
    const response = await expenseApi.reject(id, data);
    return response.data;
  }
);

export const markExpenseAsPaid = createAsyncThunk(
  'finance/markExpenseAsPaid',
  async (id: number) => {
    const response = await expenseApi.markAsPaid(id);
    return response.data;
  }
);

export const fetchExpenseStats = createAsyncThunk(
  'finance/fetchExpenseStats',
  async (params?: any) => {
    const response = await expenseApi.getStatistics(params);
    return response.data;
  }
);

// Salary Component Async Thunks
export const fetchSalaryComponents = createAsyncThunk(
  'finance/fetchSalaryComponents',
  async (params?: any) => {
    const response = await salaryComponentApi.getAll(params);
    return response.data;
  }
);

export const fetchSalaryComponentById = createAsyncThunk(
  'finance/fetchSalaryComponentById',
  async (id: number) => {
    const response = await salaryComponentApi.getById(id);
    return response.data;
  }
);

export const createSalaryComponent = createAsyncThunk(
  'finance/createSalaryComponent',
  async (data: CreateSalaryComponentRequest) => {
    const response = await salaryComponentApi.create(data);
    return response.data;
  }
);

export const updateSalaryComponent = createAsyncThunk(
  'finance/updateSalaryComponent',
  async ({ id, data }: { id: number; data: UpdateSalaryComponentRequest }) => {
    const response = await salaryComponentApi.update(id, data);
    return response.data;
  }
);

export const deleteSalaryComponent = createAsyncThunk(
  'finance/deleteSalaryComponent',
  async (id: number) => {
    await salaryComponentApi.delete(id);
    return id;
  }
);

export const toggleSalaryComponentActive = createAsyncThunk(
  'finance/toggleSalaryComponentActive',
  async (id: number) => {
    const response = await salaryComponentApi.toggleActive(id);
    return response.data;
  }
);

// Finance State Interface
interface FinanceState {
  // Payroll
  payrolls: Payroll[];
  selectedPayroll: Payroll | null;
  payrollLoading: boolean;
  payrollError: string | null;
  
  // Expenses
  expenses: Expense[];
  selectedExpense: Expense | null;
  expenseLoading: boolean;
  expenseError: string | null;
  expenseStats: ExpenseStats | null;
  
  // Salary Components
  salaryComponents: SalaryComponent[];
  selectedSalaryComponent: SalaryComponent | null;
  salaryComponentLoading: boolean;
  salaryComponentError: string | null;
}

// Initial State
const initialState: FinanceState = {
  // Payroll
  payrolls: [],
  selectedPayroll: null,
  payrollLoading: false,
  payrollError: null,
  
  // Expenses
  expenses: [],
  selectedExpense: null,
  expenseLoading: false,
  expenseError: null,
  expenseStats: null,
  
  // Salary Components
  salaryComponents: [],
  selectedSalaryComponent: null,
  salaryComponentLoading: false,
  salaryComponentError: null,
};

// Finance Slice
const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    clearPayrollError: (state) => {
      state.payrollError = null;
    },
    clearExpenseError: (state) => {
      state.expenseError = null;
    },
    clearSalaryComponentError: (state) => {
      state.salaryComponentError = null;
    },
    setSelectedPayroll: (state, action: PayloadAction<Payroll | null>) => {
      state.selectedPayroll = action.payload;
    },
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
    },
    setSelectedSalaryComponent: (state, action: PayloadAction<SalaryComponent | null>) => {
      state.selectedSalaryComponent = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Payroll reducers
    builder
      .addCase(fetchPayrolls.pending, (state) => {
        state.payrollLoading = true;
        state.payrollError = null;
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.payrollLoading = false;
        state.payrolls = action.payload.data;
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.payrollLoading = false;
        state.payrollError = action.error.message || 'Failed to fetch payrolls';
      })
      .addCase(fetchPayrollById.fulfilled, (state, action) => {
        state.selectedPayroll = action.payload.data;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.payrolls.unshift(action.payload.data);
      })
      .addCase(updatePayroll.fulfilled, (state, action) => {
        const index = state.payrolls.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.payrolls[index] = action.payload.data;
        }
        if (state.selectedPayroll?.id === action.payload.data.id) {
          state.selectedPayroll = action.payload.data;
        }
      })
      .addCase(deletePayroll.fulfilled, (state, action) => {
        state.payrolls = state.payrolls.filter(p => p.id !== action.payload);
        if (state.selectedPayroll?.id === action.payload) {
          state.selectedPayroll = null;
        }
      })
      .addCase(approvePayroll.fulfilled, (state, action) => {
        const index = state.payrolls.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.payrolls[index] = action.payload.data;
        }
        if (state.selectedPayroll?.id === action.payload.data.id) {
          state.selectedPayroll = action.payload.data;
        }
      })
      .addCase(markPayrollAsPaid.fulfilled, (state, action) => {
        const index = state.payrolls.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.payrolls[index] = action.payload.data;
        }
        if (state.selectedPayroll?.id === action.payload.data.id) {
          state.selectedPayroll = action.payload.data;
        }
      })
      .addCase(generatePayrolls.fulfilled, (state, action) => {
        state.payrolls.unshift(...action.payload.data);
      });

    // Expense reducers
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.expenseLoading = true;
        state.expenseError = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenseLoading = false;
        state.expenses = action.payload.data;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.expenseLoading = false;
        state.expenseError = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.selectedExpense = action.payload.data;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload.data);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.data.id);
        if (index !== -1) {
          state.expenses[index] = action.payload.data;
        }
        if (state.selectedExpense?.id === action.payload.data.id) {
          state.selectedExpense = action.payload.data;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
        if (state.selectedExpense?.id === action.payload) {
          state.selectedExpense = null;
        }
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.data.id);
        if (index !== -1) {
          state.expenses[index] = action.payload.data;
        }
        if (state.selectedExpense?.id === action.payload.data.id) {
          state.selectedExpense = action.payload.data;
        }
      })
      .addCase(rejectExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.data.id);
        if (index !== -1) {
          state.expenses[index] = action.payload.data;
        }
        if (state.selectedExpense?.id === action.payload.data.id) {
          state.selectedExpense = action.payload.data;
        }
      })
      .addCase(markExpenseAsPaid.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.data.id);
        if (index !== -1) {
          state.expenses[index] = action.payload.data;
        }
        if (state.selectedExpense?.id === action.payload.data.id) {
          state.selectedExpense = action.payload.data;
        }
      })
      .addCase(fetchExpenseStats.fulfilled, (state, action) => {
        state.expenseStats = action.payload.data;
      });

    // Salary Component reducers
    builder
      .addCase(fetchSalaryComponents.pending, (state) => {
        state.salaryComponentLoading = true;
        state.salaryComponentError = null;
      })
      .addCase(fetchSalaryComponents.fulfilled, (state, action) => {
        state.salaryComponentLoading = false;
        state.salaryComponents = action.payload.data;
      })
      .addCase(fetchSalaryComponents.rejected, (state, action) => {
        state.salaryComponentLoading = false;
        state.salaryComponentError = action.error.message || 'Failed to fetch salary components';
      })
      .addCase(fetchSalaryComponentById.fulfilled, (state, action) => {
        state.selectedSalaryComponent = action.payload.data;
      })
      .addCase(createSalaryComponent.fulfilled, (state, action) => {
        state.salaryComponents.unshift(action.payload.data);
      })
      .addCase(updateSalaryComponent.fulfilled, (state, action) => {
        const index = state.salaryComponents.findIndex(sc => sc.id === action.payload.data.id);
        if (index !== -1) {
          state.salaryComponents[index] = action.payload.data;
        }
        if (state.selectedSalaryComponent?.id === action.payload.data.id) {
          state.selectedSalaryComponent = action.payload.data;
        }
      })
      .addCase(deleteSalaryComponent.fulfilled, (state, action) => {
        state.salaryComponents = state.salaryComponents.filter(sc => sc.id !== action.payload);
        if (state.selectedSalaryComponent?.id === action.payload) {
          state.selectedSalaryComponent = null;
        }
      })
      .addCase(toggleSalaryComponentActive.fulfilled, (state, action) => {
        const index = state.salaryComponents.findIndex(sc => sc.id === action.payload.data.id);
        if (index !== -1) {
          state.salaryComponents[index] = action.payload.data;
        }
        if (state.selectedSalaryComponent?.id === action.payload.data.id) {
          state.selectedSalaryComponent = action.payload.data;
        }
      });
  },
});

export const {
  clearPayrollError,
  clearExpenseError,
  clearSalaryComponentError,
  setSelectedPayroll,
  setSelectedExpense,
  setSelectedSalaryComponent,
} = financeSlice.actions;

export default financeSlice.reducer; 