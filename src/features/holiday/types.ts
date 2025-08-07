export interface Holiday {
  id: number;
  name: string;
  date: string;
  type: 'national' | 'company' | 'regional';
  description?: string;
  is_paid: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHolidayRequest {
  name: string;
  date: string;
  type: 'national' | 'company' | 'regional';
  description?: string;
  is_paid?: boolean;
  is_active?: boolean;
}

export interface UpdateHolidayRequest {
  name?: string;
  date?: string;
  type?: 'national' | 'company' | 'regional';
  description?: string;
  is_paid?: boolean;
  is_active?: boolean;
}

export interface HolidayFilters {
  year?: number;
  type?: string;
  is_active?: boolean;
}

export interface HolidayCheckResponse {
  is_holiday: boolean;
  holiday?: Holiday;
} 