import axios from '../../services/axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

export const meetingApi = {
  // Get all meetings
  getMeetings: (filters?: any) => 
    axios.get(`${API_BASE_URL}/meetings`, { params: filters }),

  // Get meeting by ID
  getMeeting: (id: number) => 
    axios.get(`${API_BASE_URL}/meetings/${id}`),

  // Create new meeting
  createMeeting: (data: any) => 
    axios.post(`${API_BASE_URL}/meetings`, data),

  // Update meeting
  updateMeeting: (id: number, data: any) => 
    axios.put(`${API_BASE_URL}/meetings/${id}`, data),

  // Delete meeting
  deleteMeeting: (id: number) => 
    axios.delete(`${API_BASE_URL}/meetings/${id}`),

  // Start meeting
  startMeeting: (id: number) => 
    axios.post(`${API_BASE_URL}/meetings/${id}/start`),

  // End meeting
  endMeeting: (id: number) => 
    axios.post(`${API_BASE_URL}/meetings/${id}/end`),

  // Cancel meeting
  cancelMeeting: (id: number) => 
    axios.post(`${API_BASE_URL}/meetings/${id}/cancel`),

  // Get meeting stats
  getStats: () => 
    axios.get(`${API_BASE_URL}/meetings/stats`),

  // Get meeting calendar
  getCalendar: (filters?: any) => 
    axios.get(`${API_BASE_URL}/meetings/calendar`, { params: filters }),

  // Get upcoming meetings
  getUpcoming: (filters?: any) => 
    axios.get(`${API_BASE_URL}/meetings/upcoming`, { params: filters }),

  // Get my meetings
  getMyMeetings: (filters?: any) => 
    axios.get(`${API_BASE_URL}/meetings/my-meetings`, { params: filters }),

  // Add participants
  addParticipants: (id: number, userIds: number[]) => 
    axios.post(`${API_BASE_URL}/meetings/${id}/participants`, { user_ids: userIds }),

  // Remove participant
  removeParticipant: (id: number, userId: number) => 
    axios.delete(`${API_BASE_URL}/meetings/${id}/participants/${userId}`),
}; 