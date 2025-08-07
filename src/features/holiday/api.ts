import axios from 'axios';
import { Holiday, CreateHolidayRequest, UpdateHolidayRequest, HolidayFilters, HolidayCheckResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/api';

export const holidayApi = {
  // Get all holidays
  getAll: async (): Promise<Holiday[]> => {
    const response = await axios.get(`${API_BASE_URL}/holidays`);
    return response.data.data.holidays;
  },

  // Get holiday by ID
  getById: async (id: number): Promise<Holiday> => {
    const response = await axios.get(`${API_BASE_URL}/holidays/${id}`);
    return response.data.data.holiday;
  },

  // Create new holiday
  create: async (data: CreateHolidayRequest): Promise<Holiday> => {
    const response = await axios.post(`${API_BASE_URL}/holidays`, data);
    return response.data.data.holiday;
  },

  // Update holiday
  update: async (id: number, data: UpdateHolidayRequest): Promise<Holiday> => {
    const response = await axios.put(`${API_BASE_URL}/holidays/${id}`, data);
    return response.data.data.holiday;
  },

  // Delete holiday
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/holidays/${id}`);
  },

  // Get holidays by year
  getByYear: async (year: number): Promise<Holiday[]> => {
    const response = await axios.get(`${API_BASE_URL}/holidays/year/${year}`);
    return response.data.data.holidays;
  },

  // Get holidays by type
  getByType: async (type: string): Promise<Holiday[]> => {
    const response = await axios.get(`${API_BASE_URL}/holidays/type/${type}`);
    return response.data.data.holidays;
  },

  // Get active holidays
  getActive: async (): Promise<Holiday[]> => {
    const response = await axios.get(`${API_BASE_URL}/holidays/active/list`);
    return response.data.data.holidays;
  },

  // Get upcoming holidays
  getUpcoming: async (days: number = 30): Promise<Holiday[]> => {
    const response = await axios.get(`${API_BASE_URL}/holidays/upcoming/list?days=${days}`);
    return response.data.data.holidays;
  },

  // Check if date is holiday
  checkHoliday: async (date: string): Promise<HolidayCheckResponse> => {
    const response = await axios.get(`${API_BASE_URL}/holidays/check/date?date=${date}`);
    return response.data.data;
  },
}; 