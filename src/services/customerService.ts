import { Customer } from '@/types/business';
import { apiService } from './apiService';

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  orderBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  name?: string;
  email?: string;
  isActive?: boolean;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  lastPage: number;
}

export const customerService = {
  getAll: async (params?: GetCustomersParams): Promise<CustomersResponse> => {
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
      const url = queryString ? `/customers?${queryString}` : '/customers';
      
      const response = await apiService.get<CustomersResponse>(url);
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Mock data for development
      return {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0
      };
    }
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
