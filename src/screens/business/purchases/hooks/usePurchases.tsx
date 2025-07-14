import { useState, useEffect, useCallback } from 'react';
import { PurchaseEntity } from '@/types/business';
import { purchaseService, GetPurchasesParams, PurchasesResponse } from '@/services/purchaseService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { PurchaseFormData, DialogMode, PurchaseStatus } from '../types';

export interface UsePurchasesReturn {
  // State
  purchases: PurchaseEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedPurchase: PurchaseEntity | null;
  receiveDialogOpen: boolean;
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
  handleEdit: (purchase: PurchaseEntity) => void;
  handleView: (purchase: PurchaseEntity) => void;
  handleDelete: (purchase: PurchaseEntity) => Promise<void>;
  handleCancel: (purchase: PurchaseEntity) => Promise<void>;
  handleMarkInTransit: (purchase: PurchaseEntity) => Promise<void>;
  handleReceive: (purchase: PurchaseEntity) => void;
  handleComplete: (purchase: PurchaseEntity) => Promise<void>;
  handleCloseDialog: () => void;
  handleCloseReceiveDialog: () => void;
  handleReceiveSubmit: (data: any) => Promise<void>;
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
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
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
        purchase_details: purchase.purchaseDetails || []
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

  const handleEdit = (purchase: PurchaseEntity) => {
    setSelectedPurchase(purchase);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (purchase: PurchaseEntity) => {
    setSelectedPurchase(purchase);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleDelete = async (purchase: PurchaseEntity) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la compra de ${purchase.supplier_name || 'Proveedor sin nombre'}?`)) {
      try {
        await purchaseService.delete(purchase.purchase_id);
        loadPurchases();
        showSnackbar('Compra eliminada exitosamente', 'success');
      } catch (error) {
        console.error('Error deleting purchase:', error);
        showSnackbar('Error al eliminar la compra', 'error');
      }
    }
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

  const handleMarkInTransit = async (purchase: PurchaseEntity) => {
    try {
      await purchaseService.markAsInTransit(purchase.purchase_id);
      loadPurchases();
      showSnackbar('Compra marcada como en tránsito', 'success');
    } catch (error) {
      console.error('Error marking purchase as in transit:', error);
      showSnackbar('Error al marcar como en tránsito', 'error');
    }
  };

  const handleReceive = (purchase: PurchaseEntity) => {
    setSelectedPurchase(purchase);
    setReceiveDialogOpen(true);
  };

  const handleComplete = async (purchase: PurchaseEntity) => {
    try {
      await purchaseService.completePurchase(purchase.purchase_id);
      loadPurchases();
      showSnackbar('Compra completada exitosamente', 'success');
    } catch (error) {
      console.error('Error completing purchase:', error);
      showSnackbar('Error al completar la compra', 'error');
    }
  };

  const handleCloseReceiveDialog = () => {
    setReceiveDialogOpen(false);
    setSelectedPurchase(null);
  };

  const handleReceiveSubmit = async (receiveData: any) => {
    if (!selectedPurchase) return;

    try {
      await purchaseService.receivePurchase({
        purchase_id: selectedPurchase.purchase_id,
        received_by: 'current-user-id', // This should come from auth context
        actual_delivery_date: new Date(),
        purchase_details: receiveData.purchase_details || []
      });
      loadPurchases();
      setReceiveDialogOpen(false);
      setSelectedPurchase(null);
      showSnackbar('Compra recibida exitosamente', 'success');
    } catch (error) {
      console.error('Error receiving purchase:', error);
      showSnackbar('Error al recibir la compra', 'error');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPurchase(null);
  };

  const handleSubmit = async (data: PurchaseFormData) => {
    try {
      // Transform PurchaseDetailFormData to match service interface
      const transformedDetails = data.purchase_details.map(detail => ({
        product_id: detail.product_id,
        product_name: detail.product_name,
        quantity: detail.quantity_ordered,
        price: detail.price,
        total_amount: detail.total_amount,
        lot_number: detail.lot_number,
        entry_date: detail.entry_date,
        expiration_date: detail.expiration_date,
      }));

      if (dialogMode === 'create') {
        await purchaseService.create({
          supplier_id: data.supplier_id,
          supplier_name: data.supplier_name,
          total_amount: data.total_amount,
          status: data.status as PurchaseStatus,
          purchase_details: transformedDetails
        });
        showSnackbar('Compra creada exitosamente', 'success');
      } else if (dialogMode === 'edit' && selectedPurchase) {
        await purchaseService.update({
          purchase_id: selectedPurchase.purchase_id,
          supplier_id: data.supplier_id,
          supplier_name: data.supplier_name,
          total_amount: data.total_amount,
          status: data.status as PurchaseStatus,
          purchase_details: transformedDetails
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
    receiveDialogOpen,
    pagination,

    // Snackbar
    snackbar,
    showSnackbar,
    hideSnackbar,

    // Actions
    loadPurchases,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCancel,
    handleMarkInTransit,
    handleReceive,
    handleComplete,
    handleCloseDialog,
    handleCloseReceiveDialog,
    handleReceiveSubmit,
    handleSubmit,
    handlePageChange,
    handlePageSizeChange,
  };
};
