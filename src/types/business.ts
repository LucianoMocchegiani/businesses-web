export interface Customer {
  customer_id: string 
  customer_name: string
  contact_email: string
  contact_phone: string
  contact_location: string
  contact_description?: string
  is_active?: boolean // solo en los gets
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
}

export interface Sale {
  sale_id: number
  business_id?: number // viene en los gets
  customer_id?: number
  total_amount: number
  sale_date: string
  payment_method: 'cash' | 'card' | 'transfer'
  created_at: string
  updated_at: string
  sale_details: SaleDetail[]
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
  purchase_date: string
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
  product?: Product
}

export interface Business {
  business_id?: number // viene en los gets
  owner_id: number
  business_name: string
  business_address?: string
  business_phone?: string
  cuil?: string
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
}

export interface Category {
  category_id: number
  category_name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Brand {
  brand_id: number
  brand_name: string
  brand_description?: string
  created_at: string
  updated_at: string
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
  created_at: string;
  updated_at: string;
}

// Frontend-friendly Sale interfaces (snake_case)
export interface SaleEntity {
  sale_id: string;
  business_id?: string; // viene en los gets
  customer_id?: string;
  customer_name?: string; // For display purposes
  total_amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  created_at: string;
  updated_at: string;
  sale_details: SaleDetailEntity[];
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
  created_at: string;
  updated_at: string;
  purchase_details: PurchaseDetailEntity[];
  // Campos para recepción
  actual_delivery_date?: string;
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
  entry_date?: string;
  expiration_date?: string;
  // Campos para control de calidad y ubicación
  quality_check?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
  quality_notes?: string;
  warehouse_location?: string;
}

export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';
