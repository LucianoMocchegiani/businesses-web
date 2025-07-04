import { SaleStatus } from '@/types/business';

export interface SaleDetailFormData {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
}

export interface SaleFormData {
  customerId?: string;
  customerName?: string;
  totalAmount?: number;
  status: SaleStatus;
  saleDetails: SaleDetailFormData[];
  notes?: string;
}

export type DialogMode = 'create' | 'edit' | 'view';

export const SALE_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'COMPLETED', label: 'Completed', color: 'success' },
  { value: 'CANCELED', label: 'Canceled', color: 'error' },
] as const;
