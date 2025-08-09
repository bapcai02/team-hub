import apiClient from '../../lib/apiClient';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  status: string;
  priority: string;
  scheduled_at?: string;
  sent_at?: string;
  retry_count: number;
  error_message?: string;
  recipients: number[];
  channel: string;
  is_read: boolean;
  category: string;
  action_url?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: number;
  user_id: number;
  category: string;
  channels: string[];
  frequency: {
    type: string;
  };
  quiet_hours?: {
    start: string;
    end: string;
  };
  is_active: boolean;
  custom_settings?: any;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id: number;
  name: string;
  category: string;
  type: string;
  title_template: string;
  message_template: string;
  variables: Array<{
    key: string;
    label: string;
    required: boolean;
    default?: string;
  }>;
  channels: string[];
  priority: string;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface NotificationStats {
  total: number;
  sent: number;
  pending: number;
  failed: number;
  unread: number;
}

export interface SendNotificationRequest {
  title: string;
  message: string;
  recipients: number[];
  type?: string;
  priority?: string;
  category?: string;
  action_url?: string;
  scheduled_at?: string;
  data?: any;
  metadata?: any;
}

export interface SendTemplateNotificationRequest {
  template_name: string;
  recipients: number[];
  data: Record<string, any>;
}

export interface UpdatePreferenceRequest {
  category: string;
  channels: string[];
  frequency: {
    type: string;
  };
  quiet_hours?: {
    start: string;
    end: string;
  };
  is_active: boolean;
}

export const notificationApi = {
  // Get user notifications
  getUserNotifications: (params?: { category?: string; status?: string; unread?: boolean }) => {
    return apiClient.get('/notifications', { params });
  },

  // Mark notification as read
  markAsRead: (id: number) => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: (category?: string) => {
    return apiClient.patch('/notifications/mark-all-read', { category });
  },

  // Get notification statistics
  getStats: () => {
    return apiClient.get('/notifications/stats');
  },

  // Send notification
  sendNotification: (data: SendNotificationRequest) => {
    return apiClient.post('/notifications/send', data);
  },

  // Send template notification
  sendTemplateNotification: (data: SendTemplateNotificationRequest) => {
    return apiClient.post('/notifications/send-template', data);
  },

  // Get notification preferences
  getPreferences: () => {
    return apiClient.get('/notifications/preferences');
  },

  // Update notification preferences
  updatePreferences: (data: UpdatePreferenceRequest) => {
    return apiClient.put('/notifications/preferences', data);
  },

  // Get notification templates
  getTemplates: (params?: { category?: string; type?: string }) => {
    return apiClient.get('/notifications/templates', { params });
  },

  // Create notification template
  createTemplate: (data: Partial<NotificationTemplate>) => {
    return apiClient.post('/notifications/templates', data);
  },

  // Update notification template
  updateTemplate: (id: number, data: Partial<NotificationTemplate>) => {
    return apiClient.put(`/notifications/templates/${id}`, data);
  },

  // Delete notification template
  deleteTemplate: (id: number) => {
    return apiClient.delete(`/notifications/templates/${id}`);
  },

  // Get notification categories
  getCategories: () => {
    return apiClient.get('/notifications/categories');
  },

  // Get notification channels
  getChannels: () => {
    return apiClient.get('/notifications/channels');
  },

  // Get notification priorities
  getPriorities: () => {
    return apiClient.get('/notifications/priorities');
  },
};