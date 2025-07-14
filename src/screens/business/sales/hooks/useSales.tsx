import { useState, useEffect, useCallback } from 'react';
import { SaleEntity } from '@/types/business';
import { saleService, GetSalesParams, SalesResponse } from '@/services/saleService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { SaleFormData, DialogMode } from '../types';

export interface UseSalesReturn {
  // State
  sales: SaleEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedSale: SaleEntity | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadSales: (params?: Partial<GetSalesParams>) => Promise<void>;
  handleCreate: () => void;
  handleEdit: (sale: SaleEntity) => void;
  handleView: (sale: SaleEntity) => void;
  handleDelete: (sale: SaleEntity) => Promise<void>;
  handleCancel: (sale: SaleEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: SaleFormData) => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
}

export const useSales = (): UseSalesReturn => {
  const [sales, setSales] = useState<SaleEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [selectedSale, setSelectedSale] = useState<SaleEntity | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadSales = useCallback(async (params?: Partial<GetSalesParams>) => {
    try {
      setLoading(true);
      
      // Use current pagination values at the time of call
      const currentPage = params?.page ?? pagination.page;
      const currentLimit = params?.limit ?? pagination.limit;
      
      const searchParams: GetSalesParams = {
        page: currentPage,
        limit: currentLimit,
        ...params
      };
      
      const response: SalesResponse = await saleService.getAll(searchParams);
      const transformedData = response.data.map((sale: any) => ({
        sale_id: sale.sale_id,
        customer_name: sale.customer?.customer_name || 'Cliente no disponible',
        total_amount: sale.total_amount,
        status: sale.status,
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_details: sale.saleDetails || []
      }));

      setSales(transformedData);
      
      // Only update pagination metadata (total, totalPages) but not page/limit
      // to avoid infinite loops
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.last_page
      }));
    } catch (error) {
      showSnackbar('Error loading sales', 'error');
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Remove pagination dependencies

  useEffect(() => {
    loadSales({ page: pagination.page, limit: pagination.limit });
  }, [pagination.page, pagination.limit]);

  const handleCreate = () => {
    setSelectedSale(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (sale: SaleEntity) => {
    if (sale.status === 'CANCELED') {
      showSnackbar('Cannot edit canceled sales', 'warning');
      return;
    }
    setSelectedSale(sale);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (sale: SaleEntity) => {
    setSelectedSale(sale);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleDelete = async (sale: SaleEntity) => {
    if (sale.status === 'COMPLETED') {
      showSnackbar('Cannot delete completed sales. Use cancel instead.', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to delete sale for ${sale.customer_name || 'Unknown Customer'}?`)) {
      try {
        await saleService.delete(sale.sale_id);
        showSnackbar('Sale deleted successfully', 'success');
        loadSales();
      } catch (error) {
        showSnackbar('Error deleting sale', 'error');
        console.error('Error deleting sale:', error);
      }
    }
  };

  const handleCancel = async (sale: SaleEntity) => {
    if (sale.status === 'CANCELED') {
      showSnackbar('Sale is already canceled', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to cancel sale for ${sale.customer_name || 'Unknown Customer'}?`)) {
      try {
        await saleService.cancel(sale.sale_id);
        showSnackbar('Sale canceled successfully', 'success');
        loadSales();
      } catch (error) {
        showSnackbar('Error canceling sale', 'error');
        console.error('Error canceling sale:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSale(null);
  };

  const handleSubmit = async (data: SaleFormData) => {
    try {
      const saleData = {
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        total_amount: data.total_amount,
        status: data.status,
        sale_details: data.sale_details.map(detail => ({
          product_id: detail.product_id,
          product_name: detail.product_name,
          quantity: detail.quantity,
          price: detail.price,
          total_amount: detail.total_amount
        }))
      };

      if (dialogMode === 'create') {
        await saleService.create(saleData);
        showSnackbar('Sale created successfully', 'success');
      } else if (dialogMode === 'edit' && selectedSale) {
        await saleService.update({
          sale_id: selectedSale.sale_id,
          ...saleData
        });
        showSnackbar('Sale updated successfully', 'success');
      }

      handleCloseDialog();
      loadSales();
    } catch (error) {
      showSnackbar(`Error ${dialogMode === 'create' ? 'creating' : 'updating'} sale`, 'error');
      console.error(`Error ${dialogMode === 'create' ? 'creating' : 'updating'} sale:`, error);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, limit: pageSize, page: 1 }));
  }, []);

  return {
    // State
    sales,
    loading,
    dialogOpen,
    dialogMode,
    selectedSale,
    pagination,
    
    // Snackbar
    snackbar,
    showSnackbar,
    hideSnackbar,
    
    // Actions
    loadSales,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCancel,
    handleCloseDialog,
    handleSubmit,
    handlePageChange,
    handlePageSizeChange,
  };
};
