import { Product } from '@/types/business';
import { apiService } from './apiService';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  orderBy?: 'name' | 'barcode' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  name?: string;
  barcode?: string;
  category?: string;
  include_stock?: boolean;
  only_low_stock?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}

export const productService = {
  getAll: async (params?: GetProductsParams): Promise<ProductsResponse> => {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
      if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.barcode) queryParams.append('barcode', params.barcode);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.include_stock !== undefined) queryParams.append('include_stock', params.include_stock.toString());
      if (params?.only_low_stock !== undefined) queryParams.append('only_low_stock', params.only_low_stock.toString());
      
      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : '/products';
      
      const response = await apiService.get<ProductsResponse>(url);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for development
      return {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0
      };
    }
  },

  getById: async (id: number): Promise<Product> => {
    return apiService.get<Product>(`/products/${id}`);
  },

  create: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return apiService.post<Product>('/business-products', productData);
  },

  update: async (id: number, productData: Partial<Product>): Promise<Product> => {
    return apiService.put<Product>(`/business-products/${id}`, productData);
  },

  delete: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/business-products/${id}`);
  },

  searchByBarcode: async (barcode: string): Promise<Product | null> => {
    try {
      const response = await apiService.get<ProductsResponse>(`/products?barcode=${barcode}&limit=1`);
      return response.data[0] || null; // Devolver el primer resultado o null
    } catch (error) {
      return null; // Product not found
    }
  },

  getLowStock: async (): Promise<ProductsResponse> => {
    return apiService.get<ProductsResponse>('/products?only_low_stock=true');
  },

  getInventoryDetail: async (productId: string): Promise<any> => {
    return apiService.get<any>(`/products/${productId}/inventory`);
  },
};
