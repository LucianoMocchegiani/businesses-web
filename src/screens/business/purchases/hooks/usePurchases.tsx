import { useState, useEffect, useCallback } from 'react';
import { PurchaseEntity } from '@/types/business';
import { purchaseService, GetPurchasesParams, PurchasesResponse } from '@/services/purchaseService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { PurchaseFormData, DialogMode, PurchaseStatus } from '../types';
import { getProductIdMapping } from '@/utils';

export interface UsePurchasesReturn {
  // State
  purchases: PurchaseEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedPurchase: PurchaseEntity | null;
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
  loadPurchases: (params?: Partial<GetPurchasesParams>) => Promise<void>;
  handleCreate: () => void;
  handleView: (purchase: PurchaseEntity) => void;
  handleCancel: (purchase: PurchaseEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleSubmit: (data: PurchaseFormData) => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
}

export const usePurchases = (): UsePurchasesReturn => {
  const [purchases, setPurchases] = useState<PurchaseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseEntity | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadPurchases = useCallback(async (params?: Partial<GetPurchasesParams>) => {
    try {
      setLoading(true);

      // Use current pagination values at the time of call
      const currentPage = params?.page ?? pagination.page;
      const currentLimit = params?.limit ?? pagination.limit;

      const searchParams: GetPurchasesParams = {
        page: currentPage,
        limit: currentLimit,
        ...params
      };

      const response: PurchasesResponse = await purchaseService.getAll(searchParams);
      const transformedData = response.data.map((purchase: any) => ({
        purchase_id: purchase.purchase_id,
        supplier_name: purchase.supplier?.supplier_name || 'Proveedor no disponible',
        total_amount: purchase.total_amount,
        status: purchase.status,
        created_at: purchase.created_at,
        updated_at: purchase.updated_at,
        purchaseDetails: purchase.purchaseDetails || []
      }));

      setPurchases(transformedData);

      // Only update pagination metadata (total, totalPages) but not page/limit
      // to avoid infinite loops
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.last_page
      }));
    } catch (error) {
      console.error('Error loading purchases:', error);
      showSnackbar('Error al cargar las compras', 'error');
    } finally {
      setLoading(false);
    }
  }, []); // Remove pagination dependencies

  const handleCreate = () => {
    setSelectedPurchase(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleView = (purchase: PurchaseEntity) => {
    setSelectedPurchase(purchase);
    setDialogMode('view');
    setDialogOpen(true);
  };


  const handleCancel = async (purchase: PurchaseEntity) => {
    if (window.confirm(`¿Estás seguro de que deseas cancelar la compra de ${purchase.supplier_name || 'Proveedor sin nombre'}?`)) {
      try {
        await purchaseService.cancel(purchase.purchase_id);
        loadPurchases();
        showSnackbar('Compra cancelada exitosamente', 'success');
      } catch (error) {
        console.error('Error canceling purchase:', error);
        showSnackbar('Error al cancelar la compra', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPurchase(null);
  };

  const handleSubmit = async (data: PurchaseFormData) => {
    try {
      // Transform PurchaseDetailFormData to match service interface
      const transformedDetails = data.purchaseDetails.map((detail: any) => {
        // Get the product ID mapping
        const productIdMapping = getProductIdMapping(detail.product_id);

        return {
          ...productIdMapping,
          quantity: detail.quantity_ordered,
          price: detail.price,
          lot_number: detail.lot_number,
          entry_date: detail.entry_date,
          expiration_date: detail.expiration_date,
        };
      });

      if (dialogMode === 'create') {
        await purchaseService.create({
          supplier_id: data.supplier_id,
          supplier_name: data.supplier_name,
          status: data.status as PurchaseStatus,
          purchaseDetails: transformedDetails
        });
        showSnackbar('Compra creada exitosamente', 'success');
      } else if (dialogMode === 'edit' && selectedPurchase) {
        await purchaseService.update({
          purchase_id: selectedPurchase.purchase_id,
          supplier_id: data.supplier_id,
          supplier_name: data.supplier_name,
          status: data.status as PurchaseStatus,
          purchaseDetails: transformedDetails
        });
        showSnackbar('Compra actualizada exitosamente', 'success');
      }

      handleCloseDialog();
      loadPurchases();
    } catch (error) {
      console.error('Error submitting purchase:', error);
      showSnackbar('Error al guardar la compra', 'error');
    }
  };

  useEffect(() => {
    loadPurchases({ page: pagination.page, limit: pagination.limit });
  }, [pagination.page, pagination.limit]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, limit: pageSize, page: 1 }));
  }, []);

  return {
    // State
    purchases,
    loading,
    dialogOpen,
    dialogMode,
    selectedPurchase,
    pagination,

    // Snackbar
    snackbar,
    showSnackbar,
    hideSnackbar,

    // Actions
    loadPurchases,
    handleCreate,
    handleView,
    handleCancel,
    handleCloseDialog,
    handleSubmit,
    handlePageChange,
    handlePageSizeChange,
  };
};
