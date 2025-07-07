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

export const supplierService = {
  getAll: async (params?: GetSuppliersParams): Promise<SuppliersResponse> => {
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
      const url = queryString ? `/suppliers?${queryString}` : '/suppliers';
      
      const response = await apiService.get<SuppliersResponse>(url);
      return response;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Mock data for development
      return {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0
      };
    }
  },

  getById: async (id: string): Promise<SupplierEntity> => {
    return apiService.get<SupplierEntity>(`/suppliers/${id}`);
  },

  create: async (supplierData: Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierEntity> => {
    return apiService.post<SupplierEntity>('/suppliers', supplierData);
  },

  update: async (id: string, supplierData: Partial<SupplierEntity>): Promise<SupplierEntity> => {
    return apiService.put<SupplierEntity>(`/suppliers/${id}`, supplierData);
  },

  delete: async (id: string): Promise<void> => {
    return apiService.delete<void>(`/suppliers/${id}`);
  },
};
