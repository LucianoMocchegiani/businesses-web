import { SaleStatus } from '@/types/business';

export interface SaleDetailFormData {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_amount: number;
  // Campos para integración con inventario
  business_product_id?: string;
  global_product_id?: string;
  businessProduct?: any;
  globalProduct?: any;
}

export interface SaleFormData {
  customer_id?: string;
  customer_name?: string;
  total_amount?: number;
  status: SaleStatus;
  comments?: string;
  saleDetails: SaleDetailFormData[];
  notes?: string;
}

export type DialogMode = 'create' | 'edit' | 'view';

export const SALE_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'COMPLETED', label: 'Completed', color: 'success' },
  { value: 'CANCELED', label: 'Canceled', color: 'error' },
] as const;
