import { Product } from '@/types/business';
import { apiService } from './apiService';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    return apiService.get<Product[]>('/products');
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
      return await apiService.get<Product>(`/products/search/barcode/${barcode}`);
    } catch (error) {
      return null; // Product not found
    }
  },

  getLowStock: async (): Promise<Product[]> => {
    return apiService.get<Product[]>('/products/low-stock');
  },
};
