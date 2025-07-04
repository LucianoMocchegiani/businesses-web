import { useState, useEffect } from 'react';
import { PurchaseEntity } from '@/types/business';
import { purchaseService } from '@/services/purchaseService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { PurchaseFormData, DialogMode } from '../types';

export interface UsePurchasesReturn {
  // State
  purchases: PurchaseEntity[];
  loading: boolean;
  dialogOpen: boolean;
  dialogMode: DialogMode;
  selectedPurchase: PurchaseEntity | null;
  receiveDialogOpen: boolean;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadPurchases: () => Promise<void>;
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
}

export const usePurchases = (): UsePurchasesReturn => {
  const [purchases, setPurchases] = useState<PurchaseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('create');
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseEntity | null>(null);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const response = await purchaseService.getAll({
        businessId: 'current-business-id', // This should come from auth context
        page: 1,
        limit: 100
      });
      setPurchases(response.data);
    } catch (error) {
      console.error('Error loading purchases:', error);
      showSnackbar('Error al cargar las compras', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    if (window.confirm(`¿Estás seguro de que deseas eliminar la compra de ${purchase.supplierName || 'Proveedor sin nombre'}?`)) {
      try {
        await purchaseService.delete(purchase.id);
        await loadPurchases();
        showSnackbar('Compra eliminada exitosamente', 'success');
      } catch (error) {
        console.error('Error deleting purchase:', error);
        showSnackbar('Error al eliminar la compra', 'error');
      }
    }
  };

  const handleCancel = async (purchase: PurchaseEntity) => {
    if (window.confirm(`¿Estás seguro de que deseas cancelar la compra de ${purchase.supplierName || 'Proveedor sin nombre'}?`)) {
      try {
        await purchaseService.cancel(purchase.id);
        await loadPurchases();
        showSnackbar('Compra cancelada exitosamente', 'success');
      } catch (error) {
        console.error('Error canceling purchase:', error);
        showSnackbar('Error al cancelar la compra', 'error');
      }
    }
  };

  const handleMarkInTransit = async (purchase: PurchaseEntity) => {
    try {
      await purchaseService.markAsInTransit(purchase.id);
      await loadPurchases();
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
      await purchaseService.completePurchase(purchase.id);
      await loadPurchases();
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
        purchaseId: selectedPurchase.id,
        receivedBy: 'current-user-id', // This should come from auth context
        actualDeliveryDate: new Date(),
        purchaseDetails: receiveData.purchaseDetails || []
      });
      await loadPurchases();
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
      const transformedDetails = data.purchaseDetails.map(detail => ({
        productId: detail.productId,
        productName: detail.productName,
        quantity: detail.quantityOrdered,
        price: detail.price,
        totalAmount: detail.totalAmount,
        lotNumber: detail.lotNumber,
        entryDate: detail.entryDate,
        expirationDate: detail.expirationDate,
      }));

      if (dialogMode === 'create') {
        await purchaseService.create({
          businessId: 'current-business-id', // This should come from auth context
          supplierId: data.supplierId,
          supplierName: data.supplierName,
          totalAmount: data.totalAmount,
          status: data.status,
          purchaseDetails: transformedDetails
        });
        showSnackbar('Compra creada exitosamente', 'success');
      } else if (dialogMode === 'edit' && selectedPurchase) {
        await purchaseService.update({
          id: selectedPurchase.id,
          businessId: 'current-business-id', // This should come from auth context
          supplierId: data.supplierId,
          supplierName: data.supplierName,
          totalAmount: data.totalAmount,
          status: data.status,
          purchaseDetails: transformedDetails
        });
        showSnackbar('Compra actualizada exitosamente', 'success');
      }
      
      handleCloseDialog();
      await loadPurchases();
    } catch (error) {
      console.error('Error submitting purchase:', error);
      showSnackbar('Error al guardar la compra', 'error');
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  return {
    // State
    purchases,
    loading,
    dialogOpen,
    dialogMode,
    selectedPurchase,
    receiveDialogOpen,
    
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
  };
};
