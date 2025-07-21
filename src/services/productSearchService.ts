import { ProductSearchResult } from '@/components/BarcodeScanner';
import { productService } from './productService';
import { Product } from '@/types/business';

class ProductSearchService {

  // Buscar productos por query
  async searchProducts(query: string): Promise<ProductSearchResult[]> {
    try {
      const searchTerm = query.toLowerCase().trim();
      
      // Buscar productos usando la API real con filtro de inventario
      const response = await productService.getAll({
        name: searchTerm,
        limit: 20,
        only_with_inventory: true // Solo productos que tienen inventario registrado
      });

      // Transformar productos de la API al formato esperado
      const results: ProductSearchResult[] = response.data.map((product: any) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_code: product.product_code || '',
        price: product.price || 0,
        stock: product.stock?.quantity || 0,
        category: product.category,
      }));

      // Si la búsqueda es por código de barras exacto, priorizar ese resultado
      if (query.trim().length > 0) {
        const exactBarcodeMatch = results.find(product =>
          product.product_code === query.trim()
        );

        if (exactBarcodeMatch) {
          return [exactBarcodeMatch];
        }
      }

      // Ordenar resultados por relevancia
      return results.sort((a, b) => {
        // Códigos de barras que empiecen con el término tienen prioridad
        const aStartsWithBarcode = a.product_code.toLowerCase().startsWith(searchTerm);
        const bStartsWithBarcode = b.product_code.toLowerCase().startsWith(searchTerm);
        
        if (aStartsWithBarcode && !bStartsWithBarcode) return -1;
        if (!aStartsWithBarcode && bStartsWithBarcode) return 1;
        
        // Nombres que empiecen con el término tienen prioridad
        const aStartsWithName = a.product_name.toLowerCase().startsWith(searchTerm);
        const bStartsWithName = b.product_name.toLowerCase().startsWith(searchTerm);
        
        if (aStartsWithName && !bStartsWithName) return -1;
        if (!aStartsWithName && bStartsWithName) return 1;
        
        // Ordenar alfabéticamente
        return a.product_name.localeCompare(b.product_name);
      }).slice(0, 10); // Limitar a 10 resultados
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Obtener producto por código de barras
  async getProductByBarcode(barcode: string): Promise<ProductSearchResult | null> {
    try {
      const response = await productService.getAll({
        barcode,
        limit: 1,
        only_with_inventory: true // Solo productos que tienen inventario registrado
      });

      if (response.data.length > 0) {
        const product = response.data[0] as any;
        return {
          product_id: product.product_id,
          product_name: product.product_name,
          product_code: product.product_code || '',
          price: product.price || 0,
          stock: product.stock?.quantity || 0,
          category: product.category,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return null;
    }
  }

  // Obtener producto por ID
  async getProductById(id: string): Promise<ProductSearchResult | null> {
    try {
      const product = await productService.getById(id) as any;
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        product_code: product.product_code || '',
        price: product.price || 0,
        stock: product.stock?.quantity || 0,
        category: product.category,
      };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  // Verificar si existe un producto por código de barras
  async existsByBarcode(barcode: string): Promise<boolean> {
    try {
      const product = await this.getProductByBarcode(barcode);
      return product !== null;
    } catch (error) {
      console.error('Error checking product by barcode:', error);
      return false;
    }
  }

  // Obtener productos con stock bajo
  async getLowStockProducts(): Promise<ProductSearchResult[]> {
    try {
      const response = await productService.getAll({
        only_low_stock: true,
        only_with_inventory: true, // Solo productos que tienen inventario registrado
        limit: 50
      });

      return response.data.map((product: any) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_code: product.product_code || '',
        price: product.price || 0,
        stock: product.stock?.quantity || 0,
        category: product.category,
      }));
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }

}

export const productSearchService = new ProductSearchService();
