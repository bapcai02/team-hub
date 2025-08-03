export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  location?: string;
  event_type: 'meeting' | 'task' | 'reminder' | 'other';
  start_time: string;
  end_time: string;
  color: string;
  is_all_day: boolean;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  participants?: Array<{
    id: number;
    name: string;
    email: string;
  }>;
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
  location?: string;
  event_type: 'meeting' | 'task' | 'reminder' | 'other';
  start_time: string;
  end_time: string;
  color?: string;
  is_all_day?: boolean;
  participant_ids?: number[];
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  location?: string;
  event_type?: 'meeting' | 'task' | 'reminder' | 'other';
  start_time?: string;
  end_time?: string;
  color?: string;
  is_all_day?: boolean;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participant_ids?: number[];
} 