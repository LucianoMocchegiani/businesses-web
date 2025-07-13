import { Product } from '@/types/business';
import { apiService } from './apiService';
import { mapProductQueryParams, transformKeysToCamel } from '@/utils/transformUtils';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  orderBy?: 'name' | 'barcode' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  name?: string;
  barcode?: string;
  category?: string;
  includeStock?: boolean;
  onlyLowStock?: boolean;
  includeGlobal?: boolean;
  includeBusiness?: boolean;
  onlyWithInventory?: boolean;
  isActive?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}

class ProductService {
  private readonly endpoint = '/products';

  async getAll(params?: GetProductsParams): Promise<ProductsResponse> {
    try {
      // Transformar parámetros a snake_case para el backend
      const transformedParams = params ? mapProductQueryParams(params) : {};
      
      // Construir query string con parámetros transformados
      const queryParams = new URLSearchParams();
      
      Object.entries(transformedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
      
      const response = await apiService.get<ProductsResponse>(url);
      
      // Transformar respuesta de snake_case a camelCase si es necesario
      return {
        ...response,
        data: response.data.map(product => transformKeysToCamel(product) as Product)
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback para desarrollo
      return {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0
      };
    }
  }

  async getById(id: string): Promise<Product> {
    const response = await apiService.get<Product>(`${this.endpoint}/${id}`);
    return transformKeysToCamel(response) as Product;
  }

  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    // Para crear productos, usamos el endpoint de business-products
    const response = await apiService.post<Product>('/business-products', productData);
    return transformKeysToCamel(response) as Product;
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await apiService.put<Product>(`/business-products/${id}`, productData);
    return transformKeysToCamel(response) as Product;
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
    return this.getAll({ onlyLowStock: true });
  }

  // Obtener detalle de inventario de producto
  async getInventoryDetail(productId: string): Promise<any> {
    try {
      const response = await apiService.get<any>(`${this.endpoint}/${productId}/inventory`);
      return transformKeysToCamel(response);
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
