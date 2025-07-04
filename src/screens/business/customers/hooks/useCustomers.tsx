import { useState, useEffect } from 'react';
import { Customer } from '@/types/business';
import { customerService } from '@/services/customerService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { CustomerFormData, DialogMode } from '../types';

export interface UseCustomersReturn {
  // State
  customers: Customer[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedCustomer: Customer | null;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadCustomers: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (customer: Customer) => void;
  handleView: (customer: Customer) => void;
  handleDelete: (customer: Customer) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: CustomerFormData) => Promise<void>;
}

export const useCustomers = (): UseCustomersReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
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

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setDialogMode('edit');
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleView = (customer: Customer) => {
    setDialogMode('view');
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
      try {
        await customerService.delete(customer.id);
        showSnackbar('Customer deleted successfully', 'success');
        loadCustomers();
      } catch (error) {
        showSnackbar('Error deleting customer', 'error');
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      if (dialogMode === 'create') {
        await customerService.create(data as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>);
        showSnackbar('Customer created successfully', 'success');
      } else if (dialogMode === 'edit' && selectedCustomer) {
        await customerService.update(selectedCustomer.id, data);
        showSnackbar('Customer updated successfully', 'success');
      }
      handleCloseDialog();
      loadCustomers();
    } catch (error) {
      showSnackbar(
        `Error ${dialogMode === 'create' ? 'creating' : 'updating'} customer`,
        'error'
      );
      console.error('Error saving customer:', error);
    }
  };

  return {
    customers,
    loading,
    dialogOpen,
    dialogMode,
    selectedCustomer,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadCustomers,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseDialog,
    handleSubmit,
  };
};
