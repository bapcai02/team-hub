import axios from '../../services/axios';
import { CreateCalendarEventRequest, UpdateCalendarEventRequest } from './types';

export const calendarApi = {
  // Get calendar events
  getEvents: (params?: any) => {
    return axios.get('/calendar/events', { params });
  },

  // Create new calendar event
  createEvent: (data: CreateCalendarEventRequest) => {
    return axios.post('/calendar/events', data);
  },

  // Update calendar event
  updateEvent: (id: number, data: UpdateCalendarEventRequest) => {
    return axios.put(`/calendar/events/${id}`, data);
  },

  // Delete calendar event
  deleteEvent: (id: number) => {
    return axios.delete(`/calendar/events/${id}`);
  },

  // Get calendar statistics
  getStats: () => {
    return axios.get('/calendar/stats');
  },

  // Get upcoming events
  getUpcomingEvents: (params?: any) => {
    return axios.get('/calendar/upcoming', { params });
  },

  // Get today's events
  getTodayEvents: () => {
    return axios.get('/calendar/today');
  },

  // Get events by type
  getEventsByType: (params?: any) => {
    return axios.get('/calendar/by-type', { params });
  },
}; 