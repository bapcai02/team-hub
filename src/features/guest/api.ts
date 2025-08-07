import axios from 'axios';
import { Guest, CreateGuestRequest, UpdateGuestRequest, GuestFilters } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const guestApi = {
  // Get all guests
  getAll: async (): Promise<Guest[]> => {
    const response = await axios.get(`${API_BASE_URL}/guests`);
    return response.data.data.guests;
  },

  // Get guest by ID
  getById: async (id: number): Promise<Guest> => {
    const response = await axios.get(`${API_BASE_URL}/guests/${id}`);
    return response.data.data.guest;
  },

  // Create new guest
  create: async (data: CreateGuestRequest): Promise<Guest> => {
    const response = await axios.post(`${API_BASE_URL}/guests`, data);
    return response.data.data.guest;
  },

  // Update guest
  update: async (id: number, data: UpdateGuestRequest): Promise<Guest> => {
    const response = await axios.patch(`${API_BASE_URL}/guests/${id}`, data);
    return response.data.data.guest;
  },

  // Delete guest
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/guests/${id}`);
  },

  // Get guests by type
  getByType: async (type: string): Promise<Guest[]> => {
    const response = await axios.get(`${API_BASE_URL}/guests/by-type?type=${type}`);
    return response.data.data.guests;
  },

  // Get guests by status
  getByStatus: async (status: string): Promise<Guest[]> => {
    const response = await axios.get(`${API_BASE_URL}/guests/by-status?status=${status}`);
    return response.data.data.guests;
  },

  // Search guests
  search: async (query: string): Promise<Guest[]> => {
    const response = await axios.get(`${API_BASE_URL}/guests/search?q=${encodeURIComponent(query)}`);
    return response.data.data.guests;
  },

  // Get active guests
  getActiveGuests: async (): Promise<Guest[]> => {
    const response = await axios.get(`${API_BASE_URL}/guests/active`);
    return response.data.data.guests;
  },

  // Get recent visits
  getRecentVisits: async (limit: number = 10): Promise<any[]> => {
    const response = await axios.get(`${API_BASE_URL}/guests/recent-visits?limit=${limit}`);
    return response.data.data.visits;
  },

  // Get guests with filters
  getWithFilters: async (filters: GuestFilters): Promise<Guest[]> => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('q', filters.search);

    const response = await axios.get(`${API_BASE_URL}/guests?${params.toString()}`);
    return response.data.data.guests;
  },
}; 