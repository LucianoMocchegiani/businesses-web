import { Timestamp } from '@/utils/dateUtils';

export interface Customer {
  customer_id: string 
  customer_name: string
  contact_email: string
  contact_phone: string
  contact_location: string
  contact_description?: string
  is_active?: boolean // solo en los gets
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Product {
  product_id: string
  global_product_id: string
  business_product_id: string
  product_name: string
  product_description?: string
  product_code?: string
  price?: number // Hacer opcional porque BusinessProduct no lo tiene
  cost?: number
  category?: string // Hacer opcional porque BusinessProduct no lo tiene
  stock?: {
    quantity: number
    low_stock_threshold: number
    is_low_stock: boolean
  }
  min_stock?: number
  is_active?: boolean // solo en los gets
  created_at: Timestamp
  updated_at: Timestamp
}

// Frontend-friendly Supplier interface (snake_case)
export interface SupplierEntity {
  supplier_id: string;
  business_id?: string; // viene en los gets
  supplier_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_location?: string;
  contact_description?: string;
  is_active?: boolean; // solo en los gets
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Frontend-friendly Sale interfaces (snake_case)
export interface SaleEntity {
  sale_id: string;
  business_id?: string; // viene en los gets
  customer_id?: string;
  customer_name?: string; // For display purposes
  total_amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  created_at: Timestamp;
  updated_at: Timestamp;
  saleDetails: SaleDetailEntity[];
}

export interface SaleDetailEntity {
  sale_detail_id: string;
  sale_id: string;
  product_id: string;
  product_name: string; // For display purposes
  quantity: number;
  price: number;
  total_amount: number;
  // Campos para integración con inventario
  business_product_id?: string;
  global_product_id?: string;
  businessProduct?: Product;
  globalProduct?: Product;
}

export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

// Frontend-friendly Purchase interfaces (snake_case)
export interface PurchaseEntity {
  purchase_id: string;
  business_id?: string; // viene en los gets
  supplier_id?: string;
  supplier_name?: string; // For display purposes
  total_amount: number;
  status: PurchaseStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
  purchaseDetails: PurchaseDetailEntity[];
  // Campos para recepción
  actual_delivery_date?: Timestamp;
  received_by?: string;
  invoice_number?: string;
  // Campos para integración con inventario
  business_product_id?: string;
  global_product_id?: string;
  businessProduct?: Product;
  globalProduct?: Product;
}

export interface PurchaseDetailEntity {
  purchase_detail_id: string;
  purchase_id: string;
  product_id: string;
  product_name: string; // For display purposes
  quantity: number;
  quantity_received?: number; // Puede diferir de quantity
  price: number;
  total_amount: number;
  lot_number?: string;
  entry_date?: Timestamp;
  expiration_date?: Timestamp;
  // Campos para control de calidad y ubicación
  quality_check?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
  quality_notes?: string;
  warehouse_location?: string;
  // Campos para integración con inventario
  business_product_id?: string;
  global_product_id?: string;
  businessProduct?: Product;
  globalProduct?: Product;
}

export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';
