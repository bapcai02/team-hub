// Import common types
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  position?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractTemplate {
  id: number;
  name: string;
  description?: string;
  type: 'employment' | 'service' | 'partnership' | 'client' | 'vendor' | 'other';
  content: string;
  variables?: Record<string, any>;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: User;
}

export interface ContractParty {
  id: number;
  contract_id: number;
  party_type: 'client' | 'vendor' | 'partner' | 'employee';
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company_name?: string;
  tax_number?: string;
  representative_name?: string;
  representative_title?: string;
  is_primary: boolean;
  additional_info?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContractSignature {
  id: number;
  contract_id: number;
  signer_id: number;
  signer_name: string;
  signer_email: string;
  signer_title?: string;
  signature_type: 'digital' | 'electronic' | 'handwritten';
  signature_data: string;
  ip_address?: string;
  user_agent?: string;
  signed_at: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  signer?: User;
}

export interface BusinessContract {
  id: number;
  contract_number: string;
  title: string;
  description?: string;
  type: 'employment' | 'service' | 'partnership' | 'client' | 'vendor' | 'other';
  template_id?: number;
  client_id?: number;
  employee_id?: number;
  value?: number;
  currency: string;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated' | 'completed';
  signature_status: 'unsigned' | 'partially_signed' | 'fully_signed';
  terms?: Record<string, any>;
  signatures?: Record<string, any>;
  file_path?: string;
  created_by: number;
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  template?: ContractTemplate;
  client?: User;
  employee?: Employee;
  creator?: User;
  approver?: User;
  parties?: ContractParty[];
  signatures_list?: ContractSignature[];
}

// Alias for backward compatibility
export type Contract = BusinessContract;

export interface ContractStats {
  total: number;
  active: number;
  expired: number;
  pending: number;
  expiring_soon: number;
  unsigned: number;
  partially_signed: number;
  fully_signed: number;
}

export interface ContractFilters {
  status?: string;
  type?: string;
  signature_status?: string;
  search?: string;
}

export interface TemplateFilters {
  type?: string;
  active?: boolean;
}

export interface CreateContractData {
  title: string;
  description?: string;
  type: 'employment' | 'service' | 'partnership' | 'client' | 'vendor' | 'other';
  template_id?: number;
  client_id?: number;
  employee_id?: number;
  value?: number;
  currency?: string;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated' | 'completed';
  terms?: Record<string, any>;
  parties?: Omit<ContractParty, 'id' | 'contract_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateContractData extends Partial<CreateContractData> {}

export interface CreateTemplateData {
  name: string;
  description?: string;
  type: 'employment' | 'service' | 'partnership' | 'client' | 'vendor' | 'other';
  content: string;
  variables?: Record<string, any>;
  is_active?: boolean;
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {}

export interface SignatureData {
  signer_name: string;
  signer_email: string;
  signer_title?: string;
  signature_type: 'digital' | 'electronic' | 'handwritten';
  signature_data: string;
}

export interface ContractState {
  contracts: BusinessContract[];
  templates: ContractTemplate[];
  stats: ContractStats | null;
  loading: boolean;
  error: string | null;
  selectedContract: BusinessContract | null;
  selectedTemplate: ContractTemplate | null;
} 