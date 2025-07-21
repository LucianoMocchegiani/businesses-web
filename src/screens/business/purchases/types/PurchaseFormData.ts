import { Product } from '@/types/business';
import { Timestamp } from '@/utils/dateUtils';

export interface PurchaseFormData {
  supplier_id?: string;
  supplier_name?: string;
  total_amount?: number;
  status?: string;
  comments?: string;
  purchaseDetails: PurchaseDetailFormData[];
  // Nuevos campos para recepción
  expected_delivery_date?: Timestamp;
  actual_delivery_date?: Timestamp;
  received_by?: string;
  quality_notes?: string;
  invoice_number?: string;
}

export interface PurchaseDetailFormData {
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_received?: number;  // Puede diferir de lo ordenado
  price: number;
  total_amount?: number;
  
  // Gestión de lotes e inventario
  lot_number?: string;
  entry_date?: Timestamp;
  expiration_date?: Timestamp;
  batch_notes?: string;
  
  // Control de calidad
  quality_check?: QualityCheckStatus;
  quality_notes?: string;
  
  // Ubicación en almacén
  warehouse_location?: string;
  shelf_location?: string;

  // Campos para integración con inventario
  business_product_id?: string;
  global_product_id?: string;
  businessProduct?: Product;
  globalProduct?: Product;

}

// Nuevos tipos para estados y procesos
export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';

export type QualityCheckStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';

export type DialogMode = 'create' | 'edit' | 'view' | 'receive' | 'quality_check';

