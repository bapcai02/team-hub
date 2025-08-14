export interface CalendarEvent {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'meeting' | 'task' | 'reminder' | 'other';
  color: string;
  is_all_day: boolean;
  location?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  user?: User;
  participants?: User[];
  reply_count?: number;
}

export interface CalendarEventParticipant {
  id: number;
  event_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CalendarEventReply {
  id: number;
  event_id: number;
  user_id: number;
  content: string;
  parent_reply_id?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  user?: User;
  parent_reply?: CalendarEventReply;
  replies?: CalendarEventReply[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface CalendarStats {
  total: number;
  today: number;
  this_month: number;
  upcoming: number;
  by_type: {
    meeting?: number;
    task?: number;
    reminder?: number;
    other?: number;
  };
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'meeting' | 'task' | 'reminder' | 'other';
  color?: string;
  is_all_day?: boolean;
  location?: string;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participants?: number[];
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  event_type?: 'meeting' | 'task' | 'reminder' | 'other';
  color?: string;
  is_all_day?: boolean;
  location?: string;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participants?: number[];
}

export interface CreateEventReplyRequest {
  content: string;
  parent_reply_id?: number;
}

export interface UpdateEventReplyRequest {
  content: string;
}

export interface CalendarEventFilters {
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  user_id?: number;
  search?: string;
} 