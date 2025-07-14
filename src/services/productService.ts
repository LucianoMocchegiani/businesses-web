import { Product } from '@/types/business';
import { apiService } from './apiService';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  order_by?: 'name' | 'barcode' | 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  name?: string;
  barcode?: string;
  category?: string;
  include_stock?: boolean;
  only_low_stock?: boolean;
  include_global?: boolean;
  include_business?: boolean;
  only_with_inventory?: boolean;
  is_active?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  last_page: number;
}

class ProductService {
  private readonly endpoint = '/products';

  async getAll(params?: GetProductsParams): Promise<ProductsResponse> {
    try {
      // Construir query string directamente
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.order_by) queryParams.append('order_by', params.order_by);
      if (params?.order_direction) queryParams.append('order_direction', params.order_direction);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.barcode) queryParams.append('barcode', params.barcode);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.include_stock !== undefined) queryParams.append('include_stock', params.include_stock.toString());
      if (params?.only_low_stock !== undefined) queryParams.append('only_low_stock', params.only_low_stock.toString());
      if (params?.include_global !== undefined) queryParams.append('include_global', params.include_global.toString());
      if (params?.include_business !== undefined) queryParams.append('include_business', params.include_business.toString());
      if (params?.only_with_inventory !== undefined) queryParams.append('only_with_inventory', params.only_with_inventory.toString());
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      return apiService.get<ProductsResponse>(url);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback para desarrollo
      return {
        data: [],
        total: 0,
        page: 1,
        last_page: 0
      };
    }
  }

  async getById(id: string): Promise<Product> {
    return apiService.get<Product>(`${this.endpoint}/${id}`);
  }

  async create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    // Para crear productos, usamos el endpoint de business-products
    return apiService.post<Product>('/business-products', productData);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    return apiService.put<Product>(`/business-products/${id}`, productData);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`/business-products/${id}`);
  }

  // Buscar producto por código de barras
  async searchByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await this.getAll({ barcode, limit: 1 });
      return response.data[0] || null;
    } catch (error) {
      console.error('Error searching product by barcode:', error);
      return null;
    }
  }

  // Obtener productos con stock bajo
  async getLowStock(): Promise<ProductsResponse> {
    return this.getAll({ only_low_stock: true });
  }

  // Obtener detalle de inventario de producto
  async getInventoryDetail(productId: string): Promise<any> {
    try {
      return apiService.get<any>(`${this.endpoint}/${productId}/inventory`);
    } catch (error) {
      console.error('Error fetching inventory detail:', error);
      return null;
    }
  }

  // Verificar si existe un producto por código de barras
  async existsByBarcode(barcode: string): Promise<boolean> {
    try {
      const product = await this.searchByBarcode(barcode);
      return product !== null;
    } catch (error) {
      console.error('Error checking product by barcode:', error);
      return false;
    }
  }
}

export const productService = new ProductService();
