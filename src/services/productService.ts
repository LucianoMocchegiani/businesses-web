import { Product } from '@/types/business';
import { apiService } from './apiService';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiService.get<{ data: Product[] }>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    return apiService.get<Product>(`/products/${id}`);
  },

  create: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return apiService.post<Product>('/products', productData);
  },

  update: async (id: number, productData: Partial<Product>): Promise<Product> => {
    return apiService.put<Product>(`/products/${id}`, productData);
  },

  delete: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/products/${id}`);
  },

  searchByBarcode: async (barcode: string): Promise<Product | null> => {
    try {
      const response = await apiService.get<{ data: Product[] }>(`/products?barcode=${barcode}`);
      return response.data[0] || null; // Devolver el primer resultado o null
    } catch (error) {
      return null; // Product not found
    }
  },

  getLowStock: async (): Promise<Product[]> => {
    return apiService.get<Product[]>('/products/reports/low-stock');
  },

  getInventoryDetail: async (productId: string): Promise<any> => {
    return apiService.get<any>(`/products/${productId}/inventory`);
  },
};
