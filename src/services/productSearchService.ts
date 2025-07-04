import { ProductSearchResult } from '@/components/BarcodeScanner';

// Mock data - En producción esto vendría de tu API
const mockProducts: ProductSearchResult[] = [
  {
    id: '1',
    name: 'Coca Cola 500ml',
    barcode: '7894900011517',
    price: 2.50,
    stock: 150,
    category: 'Bebidas',
  },
  {
    id: '2',
    name: 'Pan Bimbo Integral',
    barcode: '7501030400567',
    price: 3.20,
    stock: 45,
    category: 'Panadería',
  },
  {
    id: '3',
    name: 'Leche Alpura 1L',
    barcode: '7501020300890',
    price: 4.75,
    stock: 8, // Stock bajo para mostrar alerta
    category: 'Lácteos',
  },
  {
    id: '4',
    name: 'Arroz Verde Valle 1kg',
    barcode: '7501234567890',
    price: 5.50,
    stock: 120,
    category: 'Granos',
  },
  {
    id: '5',
    name: 'Aceite Cristal 1L',
    barcode: '7890123456789',
    price: 8.90,
    stock: 75,
    category: 'Aceites',
  },
];

export class ProductSearchService {
  static async searchProducts(query: string): Promise<ProductSearchResult[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 200));

    const searchTerm = query.toLowerCase().trim();
    
    // Buscar por código de barras exacto primero
    const exactBarcodeMatch = mockProducts.filter(product =>
      product.barcode === searchTerm
    );

    if (exactBarcodeMatch.length > 0) {
      return exactBarcodeMatch;
    }

    // Buscar por código de barras parcial o nombre
    const results = mockProducts.filter(product =>
      product.barcode.includes(searchTerm) ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm)
    );

    // Ordenar resultados por relevancia
    return results.sort((a, b) => {
      // Códigos de barras que empiecen con el término tienen prioridad
      const aStartsWithBarcode = a.barcode.startsWith(searchTerm);
      const bStartsWithBarcode = b.barcode.startsWith(searchTerm);
      
      if (aStartsWithBarcode && !bStartsWithBarcode) return -1;
      if (!aStartsWithBarcode && bStartsWithBarcode) return 1;
      
      // Nombres que empiecen con el término tienen prioridad
      const aStartsWithName = a.name.toLowerCase().startsWith(searchTerm);
      const bStartsWithName = b.name.toLowerCase().startsWith(searchTerm);
      
      if (aStartsWithName && !bStartsWithName) return -1;
      if (!aStartsWithName && bStartsWithName) return 1;
      
      // Ordenar alfabéticamente
      return a.name.localeCompare(b.name);
    }).slice(0, 10); // Limitar a 10 resultados
  }

  static async getProductByBarcode(barcode: string): Promise<ProductSearchResult | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const product = mockProducts.find(p => p.barcode === barcode);
    return product || null;
  }

  static async getProductById(id: string): Promise<ProductSearchResult | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const product = mockProducts.find(p => p.id === id);
    return product || null;
  }

  // En producción, estos métodos harían llamadas reales a tu API:
  
  // static async searchProducts(query: string): Promise<ProductSearchResult[]> {
  //   try {
  //     const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
  //     if (!response.ok) throw new Error('Search failed');
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error searching products:', error);
  //     throw error;
  //   }
  // }

  // static async getProductByBarcode(barcode: string): Promise<ProductSearchResult | null> {
  //   try {
  //     const response = await fetch(`/api/products/barcode/${barcode}`);
  //     if (response.status === 404) return null;
  //     if (!response.ok) throw new Error('Product fetch failed');
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error fetching product by barcode:', error);
  //     throw error;
  //   }
  // }
}

export const productSearchService = new ProductSearchService();
