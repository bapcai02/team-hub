import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchCalendarEvents, 
  fetchCalendarEvent, 
  createCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent,
  fetchEventReplies,
  createEventReply,
  updateEventReply,
  deleteEventReply,
  getUpcomingEvents
} from './api';
import { 
  CalendarEvent, 
  CalendarEventReply, 
  CreateCalendarEventRequest, 
  UpdateCalendarEventRequest,
  CreateEventReplyRequest,
  UpdateEventReplyRequest,
  CalendarEventFilters
} from './types';

interface CalendarState {
  events: CalendarEvent[];
  currentEvent: CalendarEvent | null;
  upcomingEvents: CalendarEvent[];
  replies: CalendarEventReply[];
  loading: boolean;
  error: string | null;
  filters: CalendarEventFilters;
}

const initialState: CalendarState = {
  events: [],
  currentEvent: null,
  upcomingEvents: [],
  replies: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (filters?: CalendarEventFilters) => {
    const response = await fetchCalendarEvents(filters);
    return response.data;
  }
);

export const fetchEvent = createAsyncThunk(
  'calendar/fetchEvent',
  async (id: number) => {
    const response = await fetchCalendarEvent(id);
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (data: CreateCalendarEventRequest) => {
    const response = await createCalendarEvent(data);
    return response.data;
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, data }: { id: number; data: UpdateCalendarEventRequest }) => {
    const response = await updateCalendarEvent(id, data);
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id: number) => {
    await deleteCalendarEvent(id);
    return id;
  }
);

export const fetchReplies = createAsyncThunk(
  'calendar/fetchReplies',
  async (eventId: number) => {
    const response = await fetchEventReplies(eventId);
    return response.data;
  }
);

export const createReply = createAsyncThunk(
  'calendar/createReply',
  async ({ eventId, data }: { eventId: number; data: CreateEventReplyRequest }) => {
    const response = await createEventReply(eventId, data);
    return response.data;
  }
);

export const updateReply = createAsyncThunk(
  'calendar/updateReply',
  async ({ eventId, replyId, data }: { eventId: number; replyId: number; data: UpdateEventReplyRequest }) => {
    const response = await updateEventReply(eventId, replyId, data);
    return response.data;
  }
);

export const deleteReply = createAsyncThunk(
  'calendar/deleteReply',
  async ({ eventId, replyId }: { eventId: number; replyId: number }) => {
    await deleteEventReply(eventId, replyId);
    return replyId;
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'calendar/fetchUpcomingEvents',
  async () => {
    const response = await getUpcomingEvents();
    return response.data;
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CalendarEventFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      });

    // Fetch Single Event
    builder
      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch event';
      });

    // Create Event
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create event';
      });

    // Update Event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update event';
      });

    // Delete Event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete event';
      });

    // Fetch Replies
    builder
      .addCase(fetchReplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReplies.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(fetchReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch replies';
      });

    // Create Reply
    builder
      .addCase(createReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.loading = false;
        state.replies.push(action.payload);
      })
      .addCase(createReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create reply';
      });

    // Update Reply
    builder
      .addCase(updateReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReply.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.replies.findIndex(reply => reply.id === action.payload.id);
        if (index !== -1) {
          state.replies[index] = action.payload;
        }
      })
      .addCase(updateReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update reply';
      });

    // Delete Reply
    builder
      .addCase(deleteReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReply.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = state.replies.filter(reply => reply.id !== action.payload);
      })
      .addCase(deleteReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete reply';
      });

    // Fetch Upcoming Events
    builder
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingEvents = action.payload;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch upcoming events';
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentEvent } = calendarSlice.actions;
export default calendarSlice.reducer; 