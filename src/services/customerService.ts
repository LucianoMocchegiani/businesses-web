import { Customer } from '@/types/business';
import { apiService } from './apiService';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    return apiService.get<Customer[]>('/customers');
  },

  getById: async (id: number): Promise<Customer> => {
    return apiService.get<Customer>(`/customers/${id}`);
  },

  create: async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
    return apiService.post<Customer>('/customers', customerData);
  },

  update: async (id: number, customerData: Partial<Customer>): Promise<Customer> => {
    return apiService.put<Customer>(`/customers/${id}`, customerData);
  },

  delete: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/customers/${id}`);
  },
};
