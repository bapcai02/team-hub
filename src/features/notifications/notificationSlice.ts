import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  notificationApi, 
  Notification, 
  NotificationPreference, 
  NotificationTemplate, 
  NotificationStats,
  SendNotificationRequest,
  SendTemplateNotificationRequest,
  UpdatePreferenceRequest
} from './api';

interface NotificationState {
  // Notifications
  notifications: Notification[];
  notificationsLoading: boolean;
  notificationsError: string | null;
  
  // Stats
  stats: NotificationStats | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // Preferences
  preferences: NotificationPreference[];
  preferencesLoading: boolean;
  preferencesError: string | null;
  
  // Templates
  templates: NotificationTemplate[];
  templatesLoading: boolean;
  templatesError: string | null;
  
  // Options
  categories: Record<string, string>;
  channels: Record<string, string>;
  priorities: Record<string, string>;
  
  // UI State
  selectedCategory: string | null;
  showUnreadOnly: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  notificationsLoading: false,
  notificationsError: null,
  
  stats: null,
  statsLoading: false,
  statsError: null,
  
  preferences: [],
  preferencesLoading: false,
  preferencesError: null,
  
  templates: [],
  templatesLoading: false,
  templatesError: null,
  
  categories: {},
  channels: {},
  priorities: {},
  
  selectedCategory: null,
  showUnreadOnly: false,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (filters?: { category?: string; status?: string; unread?: boolean }) => {
    const response = await notificationApi.getUserNotifications(filters);
    return response.data;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number) => {
    const response = await notificationApi.markAsRead(id);
    return { id, data: response.data };
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (category?: string) => {
    await notificationApi.markAllAsRead(category);
    return category;
  }
);

export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchStats',
  async () => {
    const response = await notificationApi.getStats();
    return response.data;
  }
);

export const sendNotification = createAsyncThunk(
  'notifications/sendNotification',
  async (data: SendNotificationRequest) => {
    const response = await notificationApi.sendNotification(data);
    return response.data;
  }
);

export const sendTemplateNotification = createAsyncThunk(
  'notifications/sendTemplateNotification',
  async (data: SendTemplateNotificationRequest) => {
    const response = await notificationApi.sendTemplateNotification(data);
    return response.data;
  }
);

export const fetchNotificationPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async () => {
    const response = await notificationApi.getPreferences();
    // Handle API response format: { data: { preferences: [...], default_preferences: {...} } }
    const data = response.data?.data?.preferences || response.data?.preferences || response.data || [];
    return Array.isArray(data) ? data : [];
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (data: UpdatePreferenceRequest) => {
    const response = await notificationApi.updatePreferences(data);
    return response.data;
  }
);

export const fetchNotificationTemplates = createAsyncThunk(
  'notifications/fetchTemplates',
  async (filters?: { category?: string; type?: string }) => {
    const response = await notificationApi.getTemplates(filters);
    return response.data;
  }
);

export const createNotificationTemplate = createAsyncThunk(
  'notifications/createTemplate',
  async (data: Partial<NotificationTemplate>) => {
    const response = await notificationApi.createTemplate(data);
    return response.data;
  }
);

export const updateNotificationTemplate = createAsyncThunk(
  'notifications/updateTemplate',
  async ({ id, data }: { id: number; data: Partial<NotificationTemplate> }) => {
    const response = await notificationApi.updateTemplate(id, data);
    return response.data;
  }
);

export const deleteNotificationTemplate = createAsyncThunk(
  'notifications/deleteTemplate',
  async (id: number) => {
    await notificationApi.deleteTemplate(id);
    return id;
  }
);

export const fetchNotificationOptions = createAsyncThunk(
  'notifications/fetchOptions',
  async () => {
    const [categoriesRes, channelsRes, prioritiesRes] = await Promise.all([
      notificationApi.getCategories(),
      notificationApi.getChannels(),
      notificationApi.getPriorities(),
    ]);
    
    return {
      categories: categoriesRes.data,
      channels: channelsRes.data,
      priorities: prioritiesRes.data,
    };
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    
    setShowUnreadOnly: (state, action: PayloadAction<boolean>) => {
      state.showUnreadOnly = action.payload;
    },
    
    clearNotificationsError: (state) => {
      state.notificationsError = null;
    },
    
    clearPreferencesError: (state) => {
      state.preferencesError = null;
    },
    
    clearTemplatesError: (state) => {
      state.templatesError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true;
        state.notificationsError = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notifications = action.payload.data || action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationsLoading = false;
        state.notificationsError = action.error.message || 'Failed to fetch notifications';
      });

    // Mark as read
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification) {
          notification.is_read = true;
        }
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.notifications.forEach(notification => {
          if (!action.payload || notification.category === action.payload) {
            notification.is_read = true;
          }
        });
      });

    // Stats
    builder
      .addCase(fetchNotificationStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.data || action.payload;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message || 'Failed to fetch stats';
      });

    // Send notification
    builder
      .addCase(sendNotification.fulfilled, (state, action) => {
        // Optionally add the new notification to the list
        state.notifications.unshift(action.payload.data || action.payload);
      });

    // Send template notification
    builder
      .addCase(sendTemplateNotification.fulfilled, (state, action) => {
        // Optionally add the new notification to the list
        state.notifications.unshift(action.payload.data || action.payload);
      });

    // Preferences
    builder
      .addCase(fetchNotificationPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.preferencesError = null;
      })
      .addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchNotificationPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.preferencesError = action.error.message || 'Failed to fetch preferences';
      });

    // Update preferences
    builder
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        const updatedPreference = action.payload.data || action.payload;
        const index = state.preferences.findIndex(p => p.category === updatedPreference.category);
        if (index >= 0) {
          state.preferences[index] = updatedPreference;
        } else {
          state.preferences.push(updatedPreference);
        }
      });

    // Templates
    builder
      .addCase(fetchNotificationTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(fetchNotificationTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.templates = action.payload.data || action.payload;
      })
      .addCase(fetchNotificationTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.error.message || 'Failed to fetch templates';
      });

    // Create template
    builder
      .addCase(createNotificationTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload.data || action.payload);
      });

    // Update template
    builder
      .addCase(updateNotificationTemplate.fulfilled, (state, action) => {
        const updatedTemplate = action.payload.data || action.payload;
        const index = state.templates.findIndex(t => t.id === updatedTemplate.id);
        if (index >= 0) {
          state.templates[index] = updatedTemplate;
        }
      });

    // Delete template
    builder
      .addCase(deleteNotificationTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
      });

    // Options
    builder
      .addCase(fetchNotificationOptions.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.channels = action.payload.channels;
        state.priorities = action.payload.priorities;
      });
  },
});

export const {
  setSelectedCategory,
  setShowUnreadOnly,
  clearNotificationsError,
  clearPreferencesError,
  clearTemplatesError,
} = notificationSlice.actions;

export default notificationSlice.reducer;