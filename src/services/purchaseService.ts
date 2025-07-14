import { apiService } from './apiService';
import { PurchaseEntity, PurchaseStatus } from '@/types/business';
import { inventoryIntegrationService } from './inventoryIntegrationService';
import { 
  LotCreationData, 
  PurchaseStatus as FormPurchaseStatus 
} from '@/screens/business/purchases/types';

export interface CreatePurchaseRequest {
  supplier_id?: string;
  supplier_name?: string;
  total_amount?: number;
  status?: PurchaseStatus;
  purchase_details: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    total_amount?: number;
    lot_number?: string;
    entry_date?: string;
    expiration_date?: string;
  }[];
}

export interface UpdatePurchaseRequest extends Partial<CreatePurchaseRequest> {
  purchase_id: string;
  actual_delivery_date?: string;
  received_by?: string;
  invoice_number?: string;
}

export interface GetPurchasesParams {
  page?: number;
  limit?: number;
  order_by?: 'supplier_name' | 'total_amount' | 'status' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  supplier_name?: string;
  total_amount?: number;
  status?: PurchaseStatus;
  created_at?: string;
  updated_at?: string;
}

export interface PurchasesResponse {
  data: PurchaseEntity[];
  total: number;
  page: number;
  last_page: number;
}

export interface ReceivePurchaseRequest {
  purchase_id: string;
  received_by: string;
  actual_delivery_date: Date;
  purchase_details: {
    product_id: string;
    quantity_received: number;
    quality_check?: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
    quality_notes?: string;
    lot_number?: string;
    expiration_date?: Date;
    warehouse_location?: string;
  }[];
  general_notes?: string;
}

class PurchaseService {
  private readonly endpoint = '/purchases';

  async getAll(params: GetPurchasesParams): Promise<PurchasesResponse> {
    try {
      // Construir query string directamente
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.order_by) queryParams.append('order_by', params.order_by);
      if (params.order_direction) queryParams.append('order_direction', params.order_direction);
      if (params.supplier_name) queryParams.append('supplier_name', params.supplier_name);
      if (params.total_amount) queryParams.append('total_amount', params.total_amount.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.created_at) queryParams.append('created_at', params.created_at);
      if (params.updated_at) queryParams.append('updated_at', params.updated_at);
      
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
      return apiService.put<PurchaseEntity>(`${this.endpoint}/${data.purchase_id}`, data);
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
      console.log('Receiving purchase:', request.purchase_id);
      
      // 1. Actualizar estado de la compra
      const updatedPurchase = await this.update({
        purchase_id: request.purchase_id,
        status: 'RECEIVED',
        actual_delivery_date: request.actual_delivery_date.toISOString(),
        received_by: request.received_by
      });
      
      // 2. Crear datos de lotes para inventario
      const lotData: LotCreationData[] = request.purchase_details.map(detail => ({
        product_id: detail.product_id,
        lot_number: detail.lot_number || this.generateLotNumber(detail.product_id),
        quantity: detail.quantity_received,
        unit_cost: this.getProductCostFromPurchase(updatedPurchase, detail.product_id),
        entry_date: request.actual_delivery_date,
        expiration_date: detail.expiration_date,
        supplier_id: updatedPurchase.supplier_id || '',
        purchase_id: request.purchase_id,
        location: detail.warehouse_location
      }));
      
      // 3. Crear lotes en inventario
      const createdLots = await inventoryIntegrationService.createLotsFromPurchase(
        request.purchase_id,
        lotData
      );
      
      // 4. Actualizar stock de productos
      const uniqueProductIds = [...new Set(lotData.map(lot => lot.product_id))];
      for (const productId of uniqueProductIds) {
        await inventoryIntegrationService.updateProductStock(productId);
      }
      
      console.log(`Purchase ${request.purchase_id} received successfully. Created ${createdLots.length} lots.`);
      
      return updatedPurchase;
      
    } catch (error) {
      console.error('Error receiving purchase:', error);
      throw new Error('Failed to receive purchase');
    }
  }
  
  // Actualizar estado a "En tránsito"
  async markAsInTransit(purchase_id: string): Promise<PurchaseEntity> {
    return this.update({
      purchase_id: purchase_id,
      status: 'IN_TRANSIT'
    });
  }
  
  // Completar purchase después de facturación
  async completePurchase(purchase_id: string, invoice_number?: string): Promise<PurchaseEntity> {
    return this.update({
      purchase_id: purchase_id,
      status: 'COMPLETED',
      invoice_number
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
  private generateLotNumber(product_id: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const productCode = product_id.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `LOT${dateStr}${productCode}${random}`;
  }
  
  private getProductCostFromPurchase(purchase: PurchaseEntity, product_id: string): number {
    const detail = purchase.purchase_details.find(d => d.product_id === product_id);
    return detail?.price || 0;
  }
}

export const purchaseService = new PurchaseService();
