import { SupplierEntity } from '@/types/business';
import { apiService } from './apiService';

export interface GetSuppliersParams {
  page?: number;
  limit?: number;
  order_by?: 'name' | 'email' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  name?: string;
  email?: string;
  is_active?: boolean;
}

export interface SuppliersResponse {
  data: SupplierEntity[];
  total: number;
  page: number;
  last_page: number;
}

class SupplierService {
  private readonly endpoint = '/suppliers';

  async getAll(params?: GetSuppliersParams): Promise<SuppliersResponse> {
    try {
      // Construir query string directamente
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.order_by) queryParams.append('order_by', params.order_by);
      if (params?.order_direction) queryParams.append('order_direction', params.order_direction);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.email) queryParams.append('email', params.email);
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      return apiService.get<SuppliersResponse>(url);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Fallback para desarrollo
      return {
        data: [],
        total: 0,
        page: 1,
        last_page: 0
      };
    }
  }

  async getById(id: string): Promise<SupplierEntity> {
    return apiService.get<SupplierEntity>(`${this.endpoint}/${id}`);
  }

  async create(supplierData: Omit<SupplierEntity, 'supplier_id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<SupplierEntity> {
    return apiService.post<SupplierEntity>(this.endpoint, supplierData);
  }

  async update(id: string, supplierData: Omit<SupplierEntity, 'supplier_id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<SupplierEntity> {
    return apiService.put<SupplierEntity>(`${this.endpoint}/${id}`, supplierData);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Verificar si existe un proveedor por email
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const response = await this.getAll({ email, limit: 1 });
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking supplier by email:', error);
      return false;
    }
  }

  // Buscar proveedores activos
  async getActiveSuppliers(params?: Omit<GetSuppliersParams, 'is_active'>): Promise<SuppliersResponse> {
    return this.getAll({ ...params, is_active: true });
  }
}

export const supplierService = new SupplierService();
