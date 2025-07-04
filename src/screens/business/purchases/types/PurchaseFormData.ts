export interface PurchaseFormData {
  supplierId?: string;
  supplierName?: string;
  totalAmount?: number;
  status?: PurchaseStatus;
  purchaseDetails: PurchaseDetailFormData[];
  // Nuevos campos para recepción
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  receivedBy?: string;
  qualityNotes?: string;
  invoiceNumber?: string;
}

export interface PurchaseDetailFormData {
  productId: string;
  productName: string;
  quantityOrdered: number;
  quantityReceived?: number;  // Puede diferir de lo ordenado
  price: number;
  totalAmount?: number;
  
  // Gestión de lotes e inventario
  lotNumber?: string;
  entryDate?: string;
  expirationDate?: string;
  batchNotes?: string;
  
  // Control de calidad
  qualityCheck?: QualityCheckStatus;
  qualityNotes?: string;
  
  // Ubicación en almacén
  warehouseLocation?: string;
  shelfLocation?: string;
}

// Nuevos tipos para estados y procesos
export type PurchaseStatus = 'PENDING' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED' | 'INVOICED' | 'COMPLETED' | 'CANCELED';

export type QualityCheckStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';

export interface QualityCheckResult {
  status: QualityCheckStatus;
  inspectedBy: string;
  inspectionDate: Date;
  approvedQuantity: number;
  rejectedQuantity: number;
  notes?: string;
}

export interface LotCreationData {
  productId: string;
  lotNumber: string;
  quantity: number;
  unitCost: number;
  entryDate: Date;
  expirationDate?: Date;
  supplierId: string;
  purchaseId: string;
  location?: string;
}

export interface InventoryMovement {
  type: 'PURCHASE_IN' | 'SALE_OUT' | 'ADJUSTMENT' | 'TRANSFER';
  productId: string;
  lotNumber?: string;
  quantity: number;
  unitCost?: number;
  reference: string; // Purchase ID, Sale ID, etc.
  performedBy: string;
  notes?: string;
}

export type DialogMode = 'create' | 'edit' | 'view' | 'receive' | 'quality_check';
