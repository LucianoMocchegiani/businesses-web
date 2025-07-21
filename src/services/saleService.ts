import { apiService } from './apiService';
import { SaleEntity, SaleStatus } from '@/types/business';
import { Timestamp } from '@/utils/dateUtils';

export interface CreateSaleRequest {
  customer_id?: string;
  customer_name?: string;
  status?: SaleStatus;
  saleDetails: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  sale_id: string;
}

export interface GetSalesParams {
  page?: number;
  limit?: number;
  order_by?: 'customer_name' | 'total_amount' | 'status' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  customer_id?: string;
  customer_name?: string;
  total_amount?: number;
  status?: SaleStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface SalesResponse {
  data: SaleEntity[];
  total: number;
  page: number;
  last_page: number;
}

class SaleService {
  private readonly endpoint = '/sales';

  async getAll(params: GetSalesParams): Promise<SalesResponse> {
    try {
      // Construir query string directamente
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.order_by) queryParams.append('order_by', params.order_by);
      if (params.order_direction) queryParams.append('order_direction', params.order_direction);
      if (params.customer_id) queryParams.append('customer_id', params.customer_id);
      if (params.customer_name) queryParams.append('customer_name', params.customer_name);
      if (params.total_amount) queryParams.append('total_amount', params.total_amount.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.created_at) queryParams.append('created_at', params.created_at.toString());
      if (params.updated_at) queryParams.append('updated_at', params.updated_at.toString());

      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;

      return apiService.get<SalesResponse>(url);
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<SaleEntity> {
    try {
      return apiService.get<SaleEntity>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  }

  async create(data: CreateSaleRequest): Promise<SaleEntity> {
    try {
      return apiService.post<SaleEntity>(this.endpoint, data);
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  async update(data: UpdateSaleRequest): Promise<SaleEntity> {
    try {
      return apiService.put<SaleEntity>(`${this.endpoint}/${data.sale_id}`, data);
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  }

  async cancel(id: string): Promise<SaleEntity> {
    try {
      return apiService.delete<SaleEntity>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error canceling sale:', error);
      throw error;
    }
  }
}

export const saleService = new SaleService();
