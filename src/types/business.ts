export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  taxId?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: number
  name: string
  description?: string
  price?: number // Hacer opcional porque BusinessProduct no lo tiene
  cost?: number
  barcode?: string
  category?: string // Hacer opcional porque BusinessProduct no lo tiene
  stock?: number
  minStock?: number
  isActive?: boolean // Hacer opcional
  createdAt: Date
  updatedAt: Date
}

export interface Sale {
  sale_id: number
  business_id: number
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
  business_id: number
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
  business_id: number
  product_id: number
  stock_quantity: number
  min_stock?: number
  max_stock?: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Business {
  business_id: number
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
  business_id: number
  supplier_name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
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

// Frontend-friendly Supplier interface (following Customer pattern)
export interface SupplierEntity {
  id: string;
  businessId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend-friendly Sale interfaces (aligned with backend)
export interface SaleEntity {
  id: string;
  businessId: string;
  customerId?: string;
  customerName?: string; // For display purposes
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  updatedAt: string;
  saleDetails: SaleDetailEntity[];
}

export interface SaleDetailEntity {
  id: string;
  saleId: string;
  productId: string;
  productName: string; // For display purposes
  quantity: number;
  price: number;
  totalAmount: number;
}

export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

// Frontend-friendly Purchase interfaces (aligned with backend)
export interface PurchaseEntity {
  id: string;
  businessId: string;
  supplierId?: string;
  supplierName?: string; // For display purposes
  totalAmount: number;
  status: PurchaseStatus;
  createdAt: string;
  updatedAt: string;
  purchaseDetails: PurchaseDetailEntity[];
  // Nuevos campos para recepción
  actualDeliveryDate?: string;
  receivedBy?: string;
  invoiceNumber?: string;
}

export interface PurchaseDetailEntity {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string; // For display purposes
  quantity: number;
  quantityReceived?: number; // Puede diferir de quantity
  price: number;
  totalAmount: number;
  lotNumber?: string;
  entryDate?: string;
  expirationDate?: string;
  // Nuevos campos para control de calidad y ubicación
  qualityCheck?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
  qualityNotes?: string;
  warehouseLocation?: string;
}

export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';
