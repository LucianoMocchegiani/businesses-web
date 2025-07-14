import { Customer } from '@/types/business';
import { apiService } from './apiService';

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  order_by?: 'name' | 'email' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  name?: string;
  email?: string;
  is_active?: boolean;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  last_page: number;
}

class CustomerService {
  private readonly endpoint = '/customers';

  async getAll(params?: GetCustomersParams): Promise<CustomersResponse> {
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
      
      return apiService.get<CustomersResponse>(url);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Fallback para desarrollo
      return {
        data: [],
        total: 0,
        page: 1,
        last_page: 0
      };
    }
  }

  async getById(id: number): Promise<Customer> {
    return apiService.get<Customer>(`${this.endpoint}/${id}`);
  }

  async create(customerData: Omit<Customer, 'customer_id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Customer> {
    return apiService.post<Customer>(this.endpoint, customerData);
  }

  async update(id: number, customerData: Omit<Customer, 'customer_id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Customer> {
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
  async getActiveCustomers(params?: Omit<GetCustomersParams, 'is_active'>): Promise<CustomersResponse> {
    return this.getAll({ ...params, is_active: true });
  }
}

export const customerService = new CustomerService();
