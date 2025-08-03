import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { meetingApi } from './api';

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  duration_minutes: number;
  link?: string;
  status: 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  participants?: Array<{
    id: number;
    user_id: number;
    joined_at?: string;
    left_at?: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}

export interface MeetingStats {
  total: number;
  scheduled: number;
  ongoing: number;
  finished: number;
  cancelled: number;
  upcoming: number;
}

export interface MeetingState {
  meetings: Meeting[];
  stats: MeetingStats | null;
  loading: {
    meetings: boolean;
    stats: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
  error: string | null;
}

const initialState: MeetingState = {
  meetings: [],
  stats: null,
  loading: {
    meetings: false,
    stats: false,
    creating: false,
    updating: false,
    deleting: false,
  },
  error: null,
};

// Async thunks
export const fetchMeetings = createAsyncThunk(
  'meeting/fetchMeetings',
  async (filters?: any) => {
    const response = await meetingApi.getMeetings(filters);
    return response.data.data.meetings;
  }
);

export const fetchMeetingStats = createAsyncThunk(
  'meeting/fetchStats',
  async () => {
    const response = await meetingApi.getStats();
    return response.data.data.stats;
  }
);

export const createMeeting = createAsyncThunk(
  'meeting/createMeeting',
  async (meetingData: any) => {
    const response = await meetingApi.createMeeting(meetingData);
    return response.data.data.meeting;
  }
);

export const updateMeeting = createAsyncThunk(
  'meeting/updateMeeting',
  async ({ id, data }: { id: number; data: any }) => {
    const response = await meetingApi.updateMeeting(id, data);
    return response.data.data.meeting;
  }
);

export const deleteMeeting = createAsyncThunk(
  'meeting/deleteMeeting',
  async (id: number) => {
    await meetingApi.deleteMeeting(id);
    return id;
  }
);

export const startMeeting = createAsyncThunk(
  'meeting/startMeeting',
  async (id: number) => {
    const response = await meetingApi.startMeeting(id);
    return response.data.data.meeting;
  }
);

export const endMeeting = createAsyncThunk(
  'meeting/endMeeting',
  async (id: number) => {
    const response = await meetingApi.endMeeting(id);
    return response.data.data.meeting;
  }
);

export const cancelMeeting = createAsyncThunk(
  'meeting/cancelMeeting',
  async (id: number) => {
    const response = await meetingApi.cancelMeeting(id);
    return response.data.data.meeting;
  }
);

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMeetings: (state) => {
      state.meetings = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch meetings
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading.meetings = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading.meetings = false;
        state.meetings = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading.meetings = false;
        state.error = action.error.message || 'Failed to fetch meetings';
      });

    // Fetch stats
    builder
      .addCase(fetchMeetingStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchMeetingStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchMeetingStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });

    // Create meeting
    builder
      .addCase(createMeeting.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.meetings.unshift(action.payload);
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.error.message || 'Failed to create meeting';
      });

    // Update meeting
    builder
      .addCase(updateMeeting.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.meetings.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.error.message || 'Failed to update meeting';
      });

    // Delete meeting
    builder
      .addCase(deleteMeeting.pending, (state) => {
        state.loading.deleting = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.meetings = state.meetings.filter(m => m.id !== action.payload);
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.error.message || 'Failed to delete meeting';
      });

    // Start meeting
    builder
      .addCase(startMeeting.fulfilled, (state, action) => {
        const index = state.meetings.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      });

    // End meeting
    builder
      .addCase(endMeeting.fulfilled, (state, action) => {
        const index = state.meetings.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      });

    // Cancel meeting
    builder
      .addCase(cancelMeeting.fulfilled, (state, action) => {
        const index = state.meetings.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.meetings[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearMeetings } = meetingSlice.actions;
export default meetingSlice.reducer; 