import { apiService } from './apiService';
import { PurchaseEntity, PurchaseStatus } from '@/types/business';
import { Timestamp } from '@/utils/dateUtils';

export interface CreatePurchaseRequest {
  supplier_id?: string;
  status?: PurchaseStatus;
  purchaseDetails: {
    global_product_id?: string;
    business_product_id?: string;
    quantity: number;
    price: number;
    lot_number?: string;
    entry_date?: Timestamp;
    expiration_date?: Timestamp;
  }[];
}

export interface UpdatePurchaseRequest extends Partial<CreatePurchaseRequest> {
  purchase_id: string;
  actual_delivery_date?: Timestamp;
  received_by?: string;
  invoice_number?: string;
}

export interface GetPurchasesParams {
  page?: number;
  limit?: number;
  order_by?: 'supplier_id' | 'total_amount' | 'status' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  supplier_id?: string;
  total_amount?: number;
  status?: PurchaseStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
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
  actual_delivery_date: Timestamp;
  purchaseDetails: {
    product_id: string;
    quantity_received: number;
    quality_check?: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
    quality_notes?: string;
    lot_number?: string;
    expiration_date?: Timestamp;
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
      if (params.supplier_id) queryParams.append('supplier_id', params.supplier_id);
      if (params.total_amount) queryParams.append('total_amount', params.total_amount.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.created_at) queryParams.append('created_at', params.created_at.toString());
      if (params.updated_at) queryParams.append('updated_at', params.updated_at.toString());
      
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

  async cancel(id: string): Promise<PurchaseEntity> {
    try {
      return apiService.delete<PurchaseEntity>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error canceling purchase:', error);
      throw error;
    }
  }
}

export const purchaseService = new PurchaseService();
