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

class CustomerService {
  private readonly endpoint = '/customers';

  async getAll(params?: GetCustomersParams): Promise<CustomersResponse> {
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
      
      return apiService.get<CustomersResponse>(url);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Fallback para desarrollo
      return {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0
      };
    }
  }

  async getById(id: number): Promise<Customer> {
    return apiService.get<Customer>(`${this.endpoint}/${id}`);
  }

  async create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return apiService.post<Customer>(this.endpoint, customerData);
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
    return apiService.put<Customer>(`${this.endpoint}/${id}`, customerData);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Verificar si existe un cliente por email
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const response = await this.getAll({ email, limit: 1 });
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking customer by email:', error);
      return false;
    }
  }

  // Buscar clientes activos
  async getActiveCustomers(params?: Omit<GetCustomersParams, 'isActive'>): Promise<CustomersResponse> {
    return this.getAll({ ...params, isActive: true });
  }
}

export const customerService = new CustomerService();
