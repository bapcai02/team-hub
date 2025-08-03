import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent, CalendarStats } from './types';
import { calendarApi } from './api';

export interface CalendarState {
  events: CalendarEvent[];
  stats: CalendarStats | null;
  loading: boolean;
  error: string | null;
  selectedEvent: CalendarEvent | null;
}

const initialState: CalendarState = {
  events: [],
  stats: null,
  loading: false,
  error: null,
  selectedEvent: null,
};

export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (_, { rejectWithValue }) => {
          try {
        const response = await calendarApi.getEvents();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar events');
    }
  }
);

export const createCalendarEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData: any, { rejectWithValue }) => {
    try {
      const response = await calendarApi.createEvent(eventData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create calendar event');
    }
  }
);

export const updateCalendarEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, ...eventData }: { id: number } & any, { rejectWithValue }) => {
    try {
      const response = await calendarApi.updateEvent(id, eventData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update calendar event');
    }
  }
);

export const deleteCalendarEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      await calendarApi.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete calendar event');
    }
  }
);

export const getCalendarStats = createAsyncThunk(
  'calendar/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarApi.getStats();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar stats');
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<CalendarEvent | null>) => {
      state.selectedEvent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch events
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create event
    builder
      .addCase(createCalendarEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update event
    builder
      .addCase(updateCalendarEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete event
    builder
      .addCase(deleteCalendarEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteCalendarEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get stats
    builder
      .addCase(getCalendarStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalendarStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getCalendarStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedEvent, clearError } = calendarSlice.actions;
export default calendarSlice.reducer; 