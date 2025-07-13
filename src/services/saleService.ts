import { apiService } from './apiService';
import { SaleEntity, SaleStatus } from '@/types/business';
import { mapSaleQueryParams, mapCreateSaleData, mapSaleResponse } from '@/utils/transformUtils';

export interface CreateSaleRequest {
  // businessId ahora viene del header x-business-id
  customerId?: string;
  customerName?: string;
  totalAmount?: number;
  status?: SaleStatus;
  saleDetails: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalAmount?: number;
  }[];
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  id: string;
}

export interface GetSalesParams {
  // businessId ahora viene del header x-business-id
  page?: number;
  limit?: number;
  orderBy?: 'customerName' | 'totalAmount' | 'status' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  customerId?: string;
  customerName?: string;
  totalAmount?: number;
  status?: SaleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesResponse {
  data: SaleEntity[];
  total: number;
  page: number;
  lastPage: number;
}

class SaleService {
  private readonly endpoint = '/sales';

  async getAll(params: GetSalesParams): Promise<SalesResponse> {
    try {
      // Transformar parámetros a snake_case para el backend
      const transformedParams = mapSaleQueryParams(params);
      
      // Construir query string con parámetros transformados
      const queryParams = new URLSearchParams();
      
      Object.entries(transformedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      const response = await apiService.get<SalesResponse>(url);
      
      // Transformar respuesta de snake_case a camelCase
      return {
        ...response,
        data: response.data.map(sale => mapSaleResponse(sale) as SaleEntity)
      };
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<SaleEntity> {
    try {
      const response = await apiService.get<SaleEntity>(`${this.endpoint}/${id}`);
      return mapSaleResponse(response) as SaleEntity;
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    }
  }

  async create(data: CreateSaleRequest): Promise<SaleEntity> {
    try {
      // Transformar datos a snake_case para el backend
      const transformedData = mapCreateSaleData(data);
      const response = await apiService.post<SaleEntity>(this.endpoint, transformedData);
      return mapSaleResponse(response) as SaleEntity;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  async update(data: UpdateSaleRequest): Promise<SaleEntity> {
    try {
      // Transformar datos a snake_case para el backend
      const transformedData = mapCreateSaleData(data);
      const response = await apiService.put<SaleEntity>(`${this.endpoint}/${data.id}`, transformedData);
      return mapSaleResponse(response) as SaleEntity;
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  }

  async cancel(id: string): Promise<SaleEntity> {
    try {
      const response = await apiService.put<SaleEntity>(`${this.endpoint}/${id}/cancel`, {});
      return mapSaleResponse(response) as SaleEntity;
    } catch (error) {
      console.error('Error canceling sale:', error);
      throw error;
    }
  }

  // Obtener ventas por estado
  async getSalesByStatus(status: SaleStatus): Promise<SalesResponse> {
    return this.getAll({ status });
  }

  // Obtener ventas por cliente
  async getSalesByCustomer(customerId: string): Promise<SalesResponse> {
    return this.getAll({ customerId });
  }

  // Verificar si una venta puede ser cancelada
  canBeCanceled(sale: SaleEntity): boolean {
    return ['PENDING', 'PROCESSING'].includes(sale.status);
  }

  // Obtener ventas completadas
  async getCompletedSales(params?: Omit<GetSalesParams, 'status'>): Promise<SalesResponse> {
    return this.getAll({ ...params, status: 'COMPLETED' });
  }

  // Obtener ventas pendientes
  async getPendingSales(params?: Omit<GetSalesParams, 'status'>): Promise<SalesResponse> {
    return this.getAll({ ...params, status: 'PENDING' });
  }
}

export const saleService = new SaleService();
