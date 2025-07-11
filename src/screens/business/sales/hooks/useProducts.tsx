import { useState, useEffect } from 'react';
import { Product } from '@/types/business';
import { productService } from '@/services/productService';
import { useSnackbar } from '@/hooks/useSnackbar';

export interface UseProductsReturn {
  // State
  products: Product[];
  loading: boolean;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadProducts: () => Promise<void>;
}

// Custom hook to obtain products and manage loading state

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({ limit: 1000, include_stock: true });
      setProducts(response.data);
    } catch (error) {
      showSnackbar('Error loading products', 'error');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadProducts,
  };
};
