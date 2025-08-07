import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { holidayApi } from './api';
import { Holiday, CreateHolidayRequest, UpdateHolidayRequest } from './types';

interface HolidayState {
  holidays: Holiday[];
  selectedHoliday: Holiday | null;
  loading: boolean;
  error: string | null;
}

const initialState: HolidayState = {
  holidays: [],
  selectedHoliday: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchHolidays = createAsyncThunk(
  'holiday/fetchHolidays',
  async () => {
    return await holidayApi.getAll();
  }
);

export const fetchHolidayById = createAsyncThunk(
  'holiday/fetchHolidayById',
  async (id: number) => {
    return await holidayApi.getById(id);
  }
);

export const createHoliday = createAsyncThunk(
  'holiday/createHoliday',
  async (data: CreateHolidayRequest) => {
    return await holidayApi.create(data);
  }
);

export const updateHoliday = createAsyncThunk(
  'holiday/updateHoliday',
  async ({ id, data }: { id: number; data: UpdateHolidayRequest }) => {
    return await holidayApi.update(id, data);
  }
);

export const deleteHoliday = createAsyncThunk(
  'holiday/deleteHoliday',
  async (id: number) => {
    await holidayApi.delete(id);
    return id;
  }
);

export const fetchHolidaysByYear = createAsyncThunk(
  'holiday/fetchHolidaysByYear',
  async (year: number) => {
    return await holidayApi.getByYear(year);
  }
);

export const fetchHolidaysByType = createAsyncThunk(
  'holiday/fetchHolidaysByType',
  async (type: string) => {
    return await holidayApi.getByType(type);
  }
);

export const fetchActiveHolidays = createAsyncThunk(
  'holiday/fetchActiveHolidays',
  async () => {
    return await holidayApi.getActive();
  }
);

export const fetchUpcomingHolidays = createAsyncThunk(
  'holiday/fetchUpcomingHolidays',
  async (days: number = 30) => {
    return await holidayApi.getUpcoming(days);
  }
);

const holidaySlice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {
    setSelectedHoliday: (state, action: PayloadAction<Holiday | null>) => {
      state.selectedHoliday = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch holidays
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch holidays';
      })

      // Fetch holiday by ID
      .addCase(fetchHolidayById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidayById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHoliday = action.payload;
      })
      .addCase(fetchHolidayById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch holiday';
      })

      // Create holiday
      .addCase(createHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays.push(action.payload);
      })
      .addCase(createHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create holiday';
      })

      // Update holiday
      .addCase(updateHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHoliday.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.holidays.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.holidays[index] = action.payload;
        }
        if (state.selectedHoliday?.id === action.payload.id) {
          state.selectedHoliday = action.payload;
        }
      })
      .addCase(updateHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update holiday';
      })

      // Delete holiday
      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        state.loading = false;
        state.holidays = state.holidays.filter(h => h.id !== action.payload);
        if (state.selectedHoliday?.id === action.payload) {
          state.selectedHoliday = null;
        }
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete holiday';
      })

      // Fetch holidays by year
      .addCase(fetchHolidaysByYear.fulfilled, (state, action) => {
        state.holidays = action.payload;
      })

      // Fetch holidays by type
      .addCase(fetchHolidaysByType.fulfilled, (state, action) => {
        state.holidays = action.payload;
      })

      // Fetch active holidays
      .addCase(fetchActiveHolidays.fulfilled, (state, action) => {
        state.holidays = action.payload;
      })

      // Fetch upcoming holidays
      .addCase(fetchUpcomingHolidays.fulfilled, (state, action) => {
        state.holidays = action.payload;
      });
  },
});

export const { setSelectedHoliday, clearError } = holidaySlice.actions;
export default holidaySlice.reducer; 