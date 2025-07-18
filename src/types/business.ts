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
  id: string
  name: string
  description?: string
  price?: number // Hacer opcional porque BusinessProduct no lo tiene
  cost?: number
  barcode?: string
  category?: string // Hacer opcional porque BusinessProduct no lo tiene
  stock?: number
  min_stock?: number
  is_active?: boolean // solo en los gets
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Sale {
  sale_id: number
  business_id?: number // viene en los gets
  customer_id?: number
  total_amount: number
  sale_date: Timestamp
  payment_method: 'cash' | 'card' | 'transfer'
  created_at: Timestamp
  updated_at: Timestamp
  saleDetails: SaleDetail[]
}

export interface SaleDetail {
  sale_detail_id: number
  sale_id: number
  product_id: number
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Purchase {
  purchase_id: number
  business_id?: number // viene en los gets
  supplier_id?: number
  total_amount: number
  purchase_date: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
  purchase_details: PurchaseDetail[]
}

export interface PurchaseDetail {
  purchase_detail_id: number
  purchase_id: number
  product_id: number
  quantity: number
  unit_cost: number
  subtotal: number
}

export interface Inventory {
  inventory_id: number
  business_id?: number // viene en los gets
  product_id: number
  stock_quantity: number
  min_stock?: number
  max_stock?: number
  created_at: Timestamp
  updated_at: Timestamp
  product?: Product
}

export interface Business {
  business_id?: number // viene en los gets
  owner_id: number
  business_name: string
  business_address?: string
  business_phone?: string
  cuil?: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Supplier {
  supplier_id: number
  business_id?: number // viene en los gets
  supplier_name: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  contact_location?: string
  contact_description?: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Category {
  category_id: number
  category_name: string
  description?: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Brand {
  brand_id: number
  brand_name: string
  brand_description?: string
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
}

export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';
