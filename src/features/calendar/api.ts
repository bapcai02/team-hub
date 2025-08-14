import axios from '../../services/axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Tạo axios instance cho calendar API
const calendarApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
calendarApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Calendar API Request - No token found in localStorage');
  }
  
  return config;
});

// Interceptor để xử lý response
calendarApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Calendar API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Calendar Events
export const fetchCalendarEvents = (params?: any) => calendarApi.get('/calendar-events', { params });
export const fetchCalendarEvent = (id: number) => calendarApi.get(`/calendar-events/${id}`);
export const createCalendarEvent = (data: any) => calendarApi.post('/calendar-events', data);
export const updateCalendarEvent = (id: number, data: any) => calendarApi.put(`/calendar-events/${id}`, data);
export const deleteCalendarEvent = (id: number) => calendarApi.delete(`/calendar-events/${id}`);

// Calendar Event Participants
export const fetchEventParticipants = (eventId: number) => calendarApi.get(`/calendar-events/${eventId}/participants`);
export const addEventParticipant = (eventId: number, userId: number) => calendarApi.post(`/calendar-events/${eventId}/participants`, { user_id: userId });
export const removeEventParticipant = (eventId: number, userId: number) => calendarApi.delete(`/calendar-events/${eventId}/participants/${userId}`);

// Calendar Event Replies
export const fetchEventReplies = (eventId: number) => calendarApi.get(`/calendar-events/${eventId}/replies`);
export const createEventReply = (eventId: number, data: any) => calendarApi.post(`/calendar-events/${eventId}/replies`, data);
export const updateEventReply = (eventId: number, replyId: number, data: any) => calendarApi.put(`/calendar-events/${eventId}/replies/${replyId}`, data);
export const deleteEventReply = (eventId: number, replyId: number) => calendarApi.delete(`/calendar-events/${eventId}/replies/${replyId}`);

// Search and Filters
export const searchCalendarEvents = (query: string) => calendarApi.get(`/calendar-events/search?q=${encodeURIComponent(query)}`);
export const getUpcomingEvents = () => calendarApi.get('/calendar-events/upcoming');
export const getEventsByType = (type: string) => calendarApi.get(`/calendar-events/type/${type}`);
export const getEventsByDateRange = (startDate: string, endDate: string) => calendarApi.get(`/calendar-events/date-range?start_date=${startDate}&end_date=${endDate}`); 