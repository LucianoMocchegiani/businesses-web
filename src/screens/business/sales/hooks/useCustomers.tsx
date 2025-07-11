import { useState, useEffect } from 'react';
import { Customer } from '@/types/business';
import { customerService } from '@/services/customerService';
import { useSnackbar } from '@/hooks/useSnackbar';

export interface UseCustomersReturn {
  // State
  customers: Customer[];
  loading: boolean;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadCustomers: () => Promise<void>;
}

// Custom hook to obtain customers and manage loading state

export const useCustomers = (): UseCustomersReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll({ limit: 1000 });
      setCustomers(response.data);
    } catch (error) {
      showSnackbar('Error loading customers', 'error');
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    loading,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadCustomers,
  };
};
