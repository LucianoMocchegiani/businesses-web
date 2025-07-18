import { useState, useEffect } from 'react';
import { SupplierEntity } from '@/types/business';
import { supplierService } from '@/services/supplierService';
import { useSnackbar } from '@/hooks/useSnackbar';

export interface UseSuppliersReturn {
  // State
  suppliers: SupplierEntity[];
  loading: boolean;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadSuppliers: () => Promise<void>;
}

// Custom hook to obtain suppliers and manage loading state

export const useSuppliers = (): UseSuppliersReturn => {
  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAll({ limit: 1000 });
      setSuppliers(response.data);
    } catch (error) {
      showSnackbar('Error loading suppliers', 'error');
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadSuppliers,
  };
}; 