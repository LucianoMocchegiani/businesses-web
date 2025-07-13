import { SupplierEntity } from '@/types/business';
import { apiService } from './apiService';

export interface GetSuppliersParams {
  page?: number;
  limit?: number;
  orderBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  name?: string;
  email?: string;
  isActive?: boolean;
}

export interface SuppliersResponse {
  data: SupplierEntity[];
  total: number;
  page: number;
  lastPage: number;
}

class SupplierService {
  private readonly endpoint = '/suppliers';

  async getAll(params?: GetSuppliersParams): Promise<SuppliersResponse> {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.email) queryParams.append('email', params.email);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      
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
        lastPage: 0
      };
    }
  }

  async getById(id: string): Promise<SupplierEntity> {
    return apiService.get<SupplierEntity>(`${this.endpoint}/${id}`);
  }

  async create(supplierData: Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierEntity> {
    return apiService.post<SupplierEntity>(this.endpoint, supplierData);
  }

  async update(id: string, supplierData: Partial<SupplierEntity>): Promise<SupplierEntity> {
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
  async getActiveSuppliers(params?: Omit<GetSuppliersParams, 'isActive'>): Promise<SuppliersResponse> {
    return this.getAll({ ...params, isActive: true });
  }
}

export const supplierService = new SupplierService();
