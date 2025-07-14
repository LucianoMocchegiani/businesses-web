export interface PurchaseFormData {
  supplier_id?: string;
  supplier_name?: string;
  total_amount?: number;
  status?: string;
  comments?: string;
  purchase_details: PurchaseDetailFormData[];
  // Nuevos campos para recepción
  expected_delivery_date?: string;
  actual_delivery_date?: string;
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
  entry_date?: string;
  expiration_date?: string;
  batch_notes?: string;
  
  // Control de calidad
  quality_check?: QualityCheckStatus;
  quality_notes?: string;
  
  // Ubicación en almacén
  warehouse_location?: string;
  shelf_location?: string;
}

// Nuevos tipos para estados y procesos
export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';

export type QualityCheckStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';

export interface QualityCheckResult {
  status: QualityCheckStatus;
  inspected_by: string;
  inspection_date: Date;
  approved_quantity: number;
  rejected_quantity: number;
  notes?: string;
}

export interface LotCreationData {
  product_id: string;
  lot_number: string;
  quantity: number;
  unit_cost: number;
  entry_date: Date;
  expiration_date?: Date;
  supplier_id: string;
  purchase_id: string;
  location?: string;
}

export interface InventoryMovement {
  type: 'PURCHASE_IN' | 'SALE_OUT' | 'ADJUSTMENT' | 'TRANSFER';
  product_id: string;
  lot_number?: string;
  quantity: number;
  unit_cost?: number;
  reference: string; // Purchase ID, Sale ID, etc.
  performed_by: string;
  notes?: string;
}

export type DialogMode = 'create' | 'edit' | 'view' | 'receive' | 'quality_check';

// Tipos para recepción de compras
export interface ReceivePurchaseFormData {
  purchase_id: number;
  details: ReceivePurchaseDetailFormData[];
}

export interface ReceivePurchaseDetailFormData {
  detail_id: number;
  received_quantity: number;
  lot_number?: string;
  entry_date?: string;
  expiration_date?: string;
}

// Tipos para integración con inventario
export interface InventoryLotCreationData {
  product_id: string;
  lot_number: string;
  quantity: number;
  expiration_date?: string;
  entry_date: string;
  purchase_price: number;
  supplier_id: string;
}

// Tipos para movimientos de stock
export interface StockMovementData {
  product_id: string;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  reference_id?: string;
}
