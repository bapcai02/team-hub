import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { guestApi } from './api';
import { Guest, GuestState, CreateGuestRequest, UpdateGuestRequest, GuestFilters } from './types';

const initialState: GuestState = {
  guests: [],
  loading: false,
  error: null,
  selectedGuest: null,
  filters: {},
  totalCount: 0,
};

// Async thunks
export const fetchGuests = createAsyncThunk(
  'guest/fetchGuests',
  async () => {
    const response = await guestApi.getAll();
    return response;
  }
);

export const fetchGuestById = createAsyncThunk(
  'guest/fetchGuestById',
  async (id: number) => {
    const response = await guestApi.getById(id);
    return response;
  }
);

export const createGuest = createAsyncThunk(
  'guest/createGuest',
  async (data: CreateGuestRequest) => {
    const response = await guestApi.create(data);
    return response;
  }
);

export const updateGuest = createAsyncThunk(
  'guest/updateGuest',
  async ({ id, data }: { id: number; data: UpdateGuestRequest }) => {
    const response = await guestApi.update(id, data);
    return response;
  }
);

export const deleteGuest = createAsyncThunk(
  'guest/deleteGuest',
  async (id: number) => {
    await guestApi.delete(id);
    return id;
  }
);

export const searchGuests = createAsyncThunk(
  'guest/searchGuests',
  async (query: string) => {
    const response = await guestApi.search(query);
    return response;
  }
);

export const getGuestsByType = createAsyncThunk(
  'guest/getGuestsByType',
  async (type: string) => {
    const response = await guestApi.getByType(type);
    return response;
  }
);

export const getGuestsByStatus = createAsyncThunk(
  'guest/getGuestsByStatus',
  async (status: string) => {
    const response = await guestApi.getByStatus(status);
    return response;
  }
);

export const getActiveGuests = createAsyncThunk(
  'guest/getActiveGuests',
  async () => {
    const response = await guestApi.getActiveGuests();
    return response;
  }
);

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setSelectedGuest: (state, action: PayloadAction<Guest | null>) => {
      state.selectedGuest = action.payload;
    },
    setFilters: (state, action: PayloadAction<GuestFilters>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearGuests: (state) => {
      state.guests = [];
    },
  },
  extraReducers: (builder) => {
    // fetchGuests
    builder
      .addCase(fetchGuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuests.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchGuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch guests';
      });

    // fetchGuestById
    builder
      .addCase(fetchGuestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGuest = action.payload;
      })
      .addCase(fetchGuestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch guest';
      });

    // createGuest
    builder
      .addCase(createGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.guests.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create guest';
      });

    // updateGuest
    builder
      .addCase(updateGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGuest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.guests.findIndex(guest => guest.id === action.payload.id);
        if (index !== -1) {
          state.guests[index] = action.payload;
        }
        if (state.selectedGuest?.id === action.payload.id) {
          state.selectedGuest = action.payload;
        }
      })
      .addCase(updateGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update guest';
      });

    // deleteGuest
    builder
      .addCase(deleteGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = state.guests.filter(guest => guest.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedGuest?.id === action.payload) {
          state.selectedGuest = null;
        }
      })
      .addCase(deleteGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete guest';
      });

    // searchGuests
    builder
      .addCase(searchGuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGuests.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(searchGuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search guests';
      });

    // getGuestsByType
    builder
      .addCase(getGuestsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGuestsByType.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(getGuestsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get guests by type';
      });

    // getGuestsByStatus
    builder
      .addCase(getGuestsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGuestsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(getGuestsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get guests by status';
      });

    // getActiveGuests
    builder
      .addCase(getActiveGuests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveGuests.fulfilled, (state, action) => {
        state.loading = false;
        state.guests = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(getActiveGuests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get active guests';
      });
  },
});

export const { setSelectedGuest, setFilters, clearError, clearGuests } = guestSlice.actions;
export default guestSlice.reducer; 