import { apiService } from './apiService';
import { PurchaseEntity, PurchaseStatus } from '@/types/business';
import { inventoryIntegrationService } from './inventoryIntegrationService';
import { 
  LotCreationData, 
  PurchaseStatus as FormPurchaseStatus 
} from '@/screens/business/purchases/types';

export interface CreatePurchaseRequest {
  supplierId?: string;
  supplierName?: string;
  totalAmount?: number;
  status?: PurchaseStatus;
  purchaseDetails: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalAmount?: number;
    lotNumber?: string;
    entryDate?: string;
    expirationDate?: string;
  }[];
}

export interface UpdatePurchaseRequest extends Partial<CreatePurchaseRequest> {
  id: string;
  actualDeliveryDate?: string;
  receivedBy?: string;
  invoiceNumber?: string;
}

export interface GetPurchasesParams {
  page?: number;
  limit?: number;
  orderBy?: 'supplierName' | 'totalAmount' | 'status' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  supplierName?: string;
  totalAmount?: number;
  status?: PurchaseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchasesResponse {
  data: PurchaseEntity[];
  total: number;
  page: number;
  lastPage: number;
}

export interface ReceivePurchaseRequest {
  purchaseId: string;
  receivedBy: string;
  actualDeliveryDate: Date;
  purchaseDetails: {
    productId: string;
    quantityReceived: number;
    qualityCheck?: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
    qualityNotes?: string;
    lotNumber?: string;
    expirationDate?: Date;
    warehouseLocation?: string;
  }[];
  generalNotes?: string;
}

class PurchaseService {
  private readonly endpoint = '/purchases';

  async getAll(params: GetPurchasesParams): Promise<PurchasesResponse> {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
      if (params.supplierName) queryParams.append('supplierName', params.supplierName);
      if (params.totalAmount) queryParams.append('totalAmount', params.totalAmount.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.createdAt) queryParams.append('createdAt', params.createdAt);
      if (params.updatedAt) queryParams.append('updatedAt', params.updatedAt);
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      return apiService.get<PurchasesResponse>(url);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<PurchaseEntity> {
    try {
      return apiService.get<PurchaseEntity>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error fetching purchase:', error);
      throw error;
    }
  }

  async create(data: CreatePurchaseRequest): Promise<PurchaseEntity> {
    try {
      return apiService.post<PurchaseEntity>(this.endpoint, data);
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  }

  async update(data: UpdatePurchaseRequest): Promise<PurchaseEntity> {
    try {
      return apiService.put<PurchaseEntity>(`${this.endpoint}/${data.id}`, data);
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    }
  }

  async cancel(id: string): Promise<PurchaseEntity> {
    try {
      return apiService.post<PurchaseEntity>(`${this.endpoint}/${id}/cancel`);
    } catch (error) {
      console.error('Error canceling purchase:', error);
      throw error;
    }
  }

  // Recibir mercadería y actualizar inventario
  async receivePurchase(request: ReceivePurchaseRequest): Promise<PurchaseEntity> {
    try {
      console.log('Receiving purchase:', request.purchaseId);
      
      // 1. Actualizar estado de la compra
      const updatedPurchase = await this.update({
        id: request.purchaseId,
        status: 'RECEIVED',
        actualDeliveryDate: request.actualDeliveryDate.toISOString(),
        receivedBy: request.receivedBy
      });
      
      // 2. Crear datos de lotes para inventario
      const lotData: LotCreationData[] = request.purchaseDetails.map(detail => ({
        productId: detail.productId,
        lotNumber: detail.lotNumber || this.generateLotNumber(detail.productId),
        quantity: detail.quantityReceived,
        unitCost: this.getProductCostFromPurchase(updatedPurchase, detail.productId),
        entryDate: request.actualDeliveryDate,
        expirationDate: detail.expirationDate,
        supplierId: updatedPurchase.supplierId || '',
        purchaseId: request.purchaseId,
        location: detail.warehouseLocation
      }));
      
      // 3. Crear lotes en inventario
      const createdLots = await inventoryIntegrationService.createLotsFromPurchase(
        request.purchaseId,
        lotData
      );
      
      // 4. Actualizar stock de productos
      const uniqueProductIds = [...new Set(lotData.map(lot => lot.productId))];
      for (const productId of uniqueProductIds) {
        await inventoryIntegrationService.updateProductStock(productId);
      }
      
      console.log(`Purchase ${request.purchaseId} received successfully. Created ${createdLots.length} lots.`);
      
      return updatedPurchase;
      
    } catch (error) {
      console.error('Error receiving purchase:', error);
      throw new Error('Failed to receive purchase');
    }
  }
  
  // Actualizar estado a "En tránsito"
  async markAsInTransit(purchaseId: string): Promise<PurchaseEntity> {
    return this.update({
      id: purchaseId,
      status: 'IN_TRANSIT'
    });
  }
  
  // Completar purchase después de facturación
  async completePurchase(purchaseId: string, invoiceNumber?: string): Promise<PurchaseEntity> {
    return this.update({
      id: purchaseId,
      status: 'COMPLETED',
      invoiceNumber
    });
  }
  
  // Obtener purchases por estado
  async getPurchasesByStatus(status: FormPurchaseStatus): Promise<PurchasesResponse> {
    return this.getAll({
      status: status as PurchaseStatus
    });
  }
  
  // Verificar si una purchase puede ser recibida
  canBeReceived(purchase: PurchaseEntity): boolean {
    return ['ORDERED', 'IN_TRANSIT'].includes(purchase.status);
  }
  
  // Métodos auxiliares privados
  private generateLotNumber(productId: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const productCode = productId.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `LOT${dateStr}${productCode}${random}`;
  }
  
  private getProductCostFromPurchase(purchase: PurchaseEntity, productId: string): number {
    const detail = purchase.purchaseDetails.find(d => d.productId === productId);
    return detail?.price || 0;
  }
}

export const purchaseService = new PurchaseService();
