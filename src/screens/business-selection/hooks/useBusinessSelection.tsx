import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService, BusinessWithProfile, CreateBusinessData } from '@/services/businessService';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useAuthContext } from '@/contexts/auth/AuthContext';
import { CreateBusinessFormData, BusinessDialogMode } from '../types/ProfileFormData';

export interface UseBusinessSelectionReturn {
  // State
  businessesWithProfiles: BusinessWithProfile[];
  loading: boolean;
  createBusinessDialogOpen: boolean;
  searchBusinessDialogOpen: boolean;
  dialogMode: BusinessDialogMode;
  error: string | null;
  
  // Snackbar
  snackbar: ReturnType<typeof useSnackbar>['snackbar'];
  showSnackbar: ReturnType<typeof useSnackbar>['showSnackbar'];
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar'];
  
  // Actions
  loadUserBusinesses: () => Promise<void>;
  handleSelectBusiness: (businessWithProfile: BusinessWithProfile) => Promise<void>;
  handleCreateBusiness: () => void;
  handleSearchBusiness: () => void;
  handleCloseDialog: () => void;
  handleSubmitNewBusiness: (data: CreateBusinessFormData) => Promise<void>;
  clearError: () => void;
}

export const useBusinessSelection = (): UseBusinessSelectionReturn => {
  const navigate = useNavigate();
  const { user, setSelectedBusinessId } = useAuthContext();
  const [businessesWithProfiles, setBusinessesWithProfiles] = useState<BusinessWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createBusinessDialogOpen, setCreateBusinessDialogOpen] = useState(false);
  const [searchBusinessDialogOpen, setSearchBusinessDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<BusinessDialogMode>('create-business');
  const [error, setError] = useState<string | null>(null);
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const loadUserBusinesses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userBusinesses = await businessService.getUserBusinesses();
      setBusinessesWithProfiles(userBusinesses);

      // Si no tiene negocios, mostrar dialog de creación automáticamente
      if (userBusinesses.length === 0) {
        setCreateBusinessDialogOpen(true);
      }
    } catch (error: any) {
      console.error('Error loading user businesses:', error);
      setError('Error al cargar los negocios. Intenta nuevamente.');
      showSnackbar('Error loading businesses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserBusinesses();
  }, [user]);

  const handleSelectBusiness = async (businessWithProfile: BusinessWithProfile) => {
    if (businessWithProfile.business.business_id) {
      setSelectedBusinessId(businessWithProfile.business.business_id);
      localStorage.setItem('selectedBusinessId', businessWithProfile.business.business_id.toString());
      localStorage.setItem('selectedProfileId', businessWithProfile.profile.profile_id.toString());
      navigate('/business/dashboard');
    }
  };

  const handleCreateBusiness = () => {
    setDialogMode('create-business');
    setCreateBusinessDialogOpen(true);
  };

  const handleSearchBusiness = () => {
    setDialogMode('search-business');
    setSearchBusinessDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCreateBusinessDialogOpen(false);
    setSearchBusinessDialogOpen(false);
  };

  const handleSubmitNewBusiness = async (data: CreateBusinessFormData) => {
    if (!user) return;

    try {
      const createBusinessData: CreateBusinessData = {
        name: data.businessName,
        address: data.address,
        phone: data.phone,
        owner_profile_name: data.ownerProfileName
      };

      const result = await businessService.createWithOwner(createBusinessData) as BusinessWithProfile;
      setBusinessesWithProfiles(prev => [...prev, result]);
      showSnackbar('Negocio creado exitosamente', 'success');
      setCreateBusinessDialogOpen(false);

      // Auto-seleccionar el negocio recién creado
      if (result.business.business_id) {
        handleSelectBusiness(result);
      }
    } catch (error: any) {
      console.error('Error creating business:', error);
      setError(error.message || 'Error al crear el negocio');
      showSnackbar('Error creating business', 'error');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    businessesWithProfiles,
    loading,
    createBusinessDialogOpen,
    searchBusinessDialogOpen,
    dialogMode,
    error,
    snackbar,
    showSnackbar,
    hideSnackbar,
    loadUserBusinesses,
    handleSelectBusiness,
    handleCreateBusiness,
    handleSearchBusiness,
    handleCloseDialog,
    handleSubmitNewBusiness,
    clearError,
  };
};
