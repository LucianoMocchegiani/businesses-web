import { useState, useEffect } from 'react';
import { SupplierEntity } from '@/types/business';
import { supplierService } from '@/services/supplierService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { SupplierFormData, DialogMode } from '../types';

export interface UseSuppliersReturn {
  // State
  suppliers: SupplierEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedSupplier: SupplierEntity | null;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadSuppliers: () => Promise<void>;
  handleCreate: () => void;
  handleEdit: (supplier: SupplierEntity) => void;
  handleView: (supplier: SupplierEntity) => void;
  handleDelete: (supplier: SupplierEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: SupplierFormData) => Promise<void>;
}

export const useSuppliers = (): UseSuppliersReturn => {
  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierEntity | null>(null);
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
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

  const handleCreate = () => {
    setDialogMode('create');
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleEdit = (supplier: SupplierEntity) => {
    setDialogMode('edit');
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleView = (supplier: SupplierEntity) => {
    setDialogMode('view');
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleDelete = async (supplier: SupplierEntity) => {
    if (window.confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) {
      try {
        await supplierService.delete(supplier.id);
        showSnackbar('Supplier deleted successfully', 'success');
        loadSuppliers();
      } catch (error) {
        showSnackbar('Error deleting supplier', 'error');
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleSubmit = async (data: SupplierFormData) => {
    try {
      if (dialogMode === 'create') {
        await supplierService.create({
          ...data,
          businessId: '1', // TODO: Get from auth context
          isActive: true,
        });
        showSnackbar('Supplier created successfully', 'success');
      } else if (dialogMode === 'edit' && selectedSupplier) {
        await supplierService.update(selectedSupplier.id, data);
        showSnackbar('Supplier updated successfully', 'success');
      }
      handleCloseDialog();
      loadSuppliers();
    } catch (error) {
      showSnackbar(
        `Error ${dialogMode === 'create' ? 'creating' : 'updating'} supplier`,
        'error'
      );
      console.error('Error saving supplier:', error);
    }
  };

  return {
    suppliers,
    loading,
    dialogOpen,
    dialogMode,
    selectedSupplier,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadSuppliers,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseDialog,
    handleSubmit,
  };
};
