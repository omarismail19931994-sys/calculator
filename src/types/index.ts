export type UserRole = 'admin' | 'manager' | 'viewer';
export type PricingType = 'fixed' | 'variable' | 'hybrid';
export type PriorityLevel = 'standard' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  pricing_type: PricingType;
  base_price: number;
  hybrid_fixed_price: number | null;
  noa_sensitivity: number;
  vat_sensitivity: number;
  ntb_sensitivity: number;
  lac_sensitivity: number;
  priority_multiplier: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  factor: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingFactors {
  id: number;
  noa_weight: number;
  vat_weight: number;
  ntb_weight: number;
  lac_weight: number;
  lac_impact_multiplier: number;
  ref_noa: number;
  ref_vat: number;
  ref_ntb: number;
  updated_at: string;
}

export interface Quote {
  id: number;
  quote_number: string;
  client_name: string;
  project_name: string;
  service_id: number;
  region: string;
  currency: string;
  noa: number;
  vat: number;
  ntb: number;
  lac: number;
  priority: string;
  base_price: number;
  adjusted_price: number;
  final_price: number;
  created_at: string;
  created_by: string | null;
}

export interface AuditLog {
  id: number;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  changes: Record<string, unknown> | null;
  timestamp: string;
}

export interface CalculatorInputs {
  clientName: string;
  projectName: string;
  serviceId: number | null;
  noa: number;
  vat: number;
  ntb: number;
  lac: number;
  regionCode: string;
  currencyCode: string;
  priority: PriorityLevel;
}

export interface CalculationBreakdown {
  noaFactor: number;
  vatFactor: number;
  ntbFactor: number;
  lacFactor: number;
  complexityFactor: number;
  basePrice: number;
  adjustedPrice: number;
  priorityMultiplier: number;
  regionalFactor: number;
  exchangeRate: number;
  finalPrice: number;
}

export interface PriorityOption {
  value: PriorityLevel;
  label: string;
  multiplier: number;
}
