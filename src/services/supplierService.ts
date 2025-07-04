import { SupplierEntity } from '@/types/business';
import { apiService } from './apiService';

export const supplierService = {
  getAll: async (): Promise<SupplierEntity[]> => {
    return apiService.get<SupplierEntity[]>('/suppliers');
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
