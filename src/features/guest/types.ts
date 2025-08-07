export interface Guest {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  type: 'guest' | 'partner' | 'vendor' | 'client';
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  avatar?: string;
  first_visit_date?: string;
  last_visit_date?: string;
  created_by: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  contacts?: GuestContact[];
  visits?: GuestVisit[];
  documents?: GuestDocument[];
}

export interface GuestContact {
  id: number;
  guest_id: number;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  contact_position?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuestVisit {
  id: number;
  guest_id: number;
  check_in: string;
  check_out?: string;
  purpose: string;
  description?: string;
  host_id?: number;
  status: 'scheduled' | 'checked_in' | 'checked_out' | 'cancelled';
  created_at: string;
  updated_at: string;
  guest?: Guest;
  host?: {
    id: number;
    name: string;
  };
}

export interface GuestDocument {
  id: number;
  guest_id: number;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGuestRequest {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  type: 'guest' | 'partner' | 'vendor' | 'client';
  status?: 'active' | 'inactive' | 'blocked';
  notes?: string;
  avatar?: string;
  first_visit_date?: string;
  last_visit_date?: string;
}

export interface UpdateGuestRequest {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  type?: 'guest' | 'partner' | 'vendor' | 'client';
  status?: 'active' | 'inactive' | 'blocked';
  notes?: string;
  avatar?: string;
  first_visit_date?: string;
  last_visit_date?: string;
}

export interface GuestFilters {
  type?: string;
  status?: string;
  search?: string;
}

export interface GuestState {
  guests: Guest[];
  loading: boolean;
  error: string | null;
  selectedGuest: Guest | null;
  filters: GuestFilters;
  totalCount: number;
} 