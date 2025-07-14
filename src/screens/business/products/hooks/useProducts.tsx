import { useState, useEffect } from 'react';
import { Product } from '@/types/business';
import { productService } from '@/services/productService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { ProductFormData, DialogMode } from '../types';

export interface UseProductsReturn {
  // State
  products: Product[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedProduct: Product | null;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadProducts: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (product: Product) => void;
  handleView: (product: Product) => void;
  handleDelete: (product: Product) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: ProductFormData) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setDialogMode('edit');
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleView = (product: Product) => {
    setDialogMode('view');
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      try {
        await productService.delete(product.id);
        showSnackbar('Product deleted successfully', 'success');
        loadProducts();
      } catch (error) {
        showSnackbar('Error deleting product', 'error');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (dialogMode === 'create') {
        await productService.create(data as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'currentStock'>);
        showSnackbar('Product created successfully', 'success');
      } else if (dialogMode === 'edit' && selectedProduct) {
        await productService.update(selectedProduct.id, data);
        showSnackbar('Product updated successfully', 'success');
      }
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      showSnackbar(
        `Error ${dialogMode === 'create' ? 'creating' : 'updating'} product`,
        'error'
      );
      console.error('Error saving product:', error);
    }
  };

  return {
    products,
    loading,
    dialogOpen,
    dialogMode,
    selectedProduct,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadProducts,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseDialog,
    handleSubmit,
  };
};
