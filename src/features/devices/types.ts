export interface Device {
  id: number;
  name: string;
  code: string;
  type: 'laptop' | 'desktop' | 'tablet' | 'phone' | 'printer' | 'scanner' | 'other';
  model: string;
  serial_number: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  assigned_to?: number;
  assigned_user?: {
    id: number;
    name: string;
    email: string;
  };
  location: string;
  department: string;
  purchase_date: string;
  warranty_expiry: string;
  specifications: {
    processor?: string;
    memory?: string;
    storage?: string;
    os?: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceStats {
  total_devices: number;
  available_devices: number;
  in_use_devices: number;
  maintenance_devices: number;
  retired_devices: number;
  utilization_rate: number;
  maintenance_rate: number;
  device_types: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  departments: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  recent_activities: Array<{
    id: number;
    device_name: string;
    action: string;
    user_name: string;
    timestamp: string;
  }>;
  warranty_alerts: Array<{
    id: number;
    device_name: string;
    warranty_expiry: string;
    days_remaining: number;
  }>;
}

export interface CreateDeviceRequest {
  name: string;
  code: string;
  type: Device['type'];
  model: string;
  serial_number: string;
  status: Device['status'];
  assigned_to?: number;
  location: string;
  department: string;
  purchase_date: string;
  warranty_expiry: string;
  specifications: Device['specifications'];
  notes?: string;
}

export interface UpdateDeviceRequest {
  name?: string;
  code?: string;
  type?: Device['type'];
  model?: string;
  serial_number?: string;
  status?: Device['status'];
  assigned_to?: number;
  location?: string;
  department?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  specifications?: Device['specifications'];
  notes?: string;
}

// Device Category Types
export interface DeviceCategory {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceCategoryRequest {
  name: string;
  code: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
}

export interface UpdateDeviceCategoryRequest {
  name?: string;
  code?: string;
  slug?: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
} 