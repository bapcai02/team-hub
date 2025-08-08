import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contractApi } from './api';
import { Contract, ContractTemplate, ContractStats } from './types';

interface ContractState {
  contracts: Contract[];
  templates: ContractTemplate[];
  stats: ContractStats | null;
  loading: boolean;
  error: string | null;
  selectedContract: Contract | null;
}

const initialState: ContractState = {
  contracts: [],
  templates: [],
  stats: null,
  loading: false,
  error: null,
  selectedContract: null,
};

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contract/fetchContracts',
  async (params?: { page?: number; search?: string; status?: string }) => {
    const response = await contractApi.getContracts(params);
    return response.data;
  }
);

export const fetchContractTemplates = createAsyncThunk(
  'contract/fetchTemplates',
  async () => {
    const response = await contractApi.getTemplates();
    console.log('API Response for templates:', response);
    console.log('API Response data:', response.data);
    return response.data;
  }
);

export const fetchContractStats = createAsyncThunk(
  'contract/fetchStats',
  async () => {
    const response = await contractApi.getStats();
    return response.data;
  }
);

export const createContract = createAsyncThunk(
  'contract/createContract',
  async (contractData: Partial<Contract>) => {
    const response = await contractApi.createContract(contractData);
    return response.data;
  }
);

export const updateContract = createAsyncThunk(
  'contract/updateContract',
  async ({ id, data }: { id: number; data: Partial<Contract> }) => {
    const response = await contractApi.updateContract(id, data);
    return response.data;
  }
);

export const deleteContract = createAsyncThunk(
  'contract/deleteContract',
  async (id: number) => {
    await contractApi.deleteContract(id);
    return id;
  }
);

export const createTemplate = createAsyncThunk(
  'contract/createTemplate',
  async (templateData: Partial<ContractTemplate>) => {
    const response = await contractApi.createTemplate(templateData);
    return response.data;
  }
);

export const updateTemplate = createAsyncThunk(
  'contract/updateTemplate',
  async ({ id, data }: { id: number; data: Partial<ContractTemplate> }) => {
    const response = await contractApi.updateTemplate(id, data);
    return response.data;
  }
);

export const deleteTemplate = createAsyncThunk(
  'contract/deleteTemplate',
  async (id: number) => {
    await contractApi.deleteTemplate(id);
    return id;
  }
);

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setSelectedContract: (state, action) => {
      state.selectedContract = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedContract: (state) => {
      state.selectedContract = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch contracts
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle paginated response structure
        const contracts = action.payload.data?.data || action.payload.data || [];
        state.contracts = contracts;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contracts';
      });

    // Fetch templates
    builder
      .addCase(fetchContractTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractTemplates.fulfilled, (state, action) => {
        state.loading = false;
        // Handle paginated response structure
        const templates = action.payload.data?.data || action.payload.data || [];
        state.templates = templates;
      })
      .addCase(fetchContractTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      });

    // Fetch stats
    builder
      .addCase(fetchContractStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchContractStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });

    // Create contract
    builder
      .addCase(createContract.fulfilled, (state, action) => {
        const newContract = action.payload.data || action.payload;
        state.contracts.unshift(newContract);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create contract';
      });

    // Update contract
    builder
      .addCase(updateContract.fulfilled, (state, action) => {
        const updatedContract = action.payload.data || action.payload;
        const index = state.contracts.findIndex(c => c.id === updatedContract.id);
        if (index !== -1) {
          state.contracts[index] = updatedContract;
        }
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update contract';
      });

    // Delete contract
    builder
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter(c => c.id !== action.payload);
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete contract';
      });

    // Create template
    builder
      .addCase(createTemplate.fulfilled, (state, action) => {
        const newTemplate = action.payload.data || action.payload;
        state.templates.unshift(newTemplate);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create template';
      });

    // Update template
    builder
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const updatedTemplate = action.payload.data || action.payload;
        const index = state.templates.findIndex(t => t.id === updatedTemplate.id);
        if (index !== -1) {
          state.templates[index] = updatedTemplate;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update template';
      });

    // Delete template
    builder
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete template';
      });
  },
});

export const { setSelectedContract, clearError, clearSelectedContract } = contractSlice.actions;
export default contractSlice.reducer; 