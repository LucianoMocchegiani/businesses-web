import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Profile } from '@/types/profile';
import { ProfileFormData, DialogMode } from '../types';
import { ProfileForm } from './ProfileForm';

interface ProfileDialogProps {
  open: boolean;
  mode: DialogMode;
  profile: Profile | null;
  onClose: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isFirstProfile?: boolean;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  mode,
  profile,
  onClose,
  onSubmit,
  isFirstProfile = false
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>();

  const getDialogTitle = () => {
    if (isFirstProfile) return 'Crear Primer Perfil';
    switch (mode) {
      case 'create': return 'Crear Nuevo Perfil';
      case 'edit': return 'Editar Perfil';
      case 'view': return 'Detalles del Perfil';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';

  // Reset form when dialog opens or profile changes
  useEffect(() => {
    if (open) {
      if (profile) {
        reset({
          profileName: profile.profile_name,
          businessName: profile.business?.business_name || '',
          permissions: {
            modifyProducts: false,
            modifyClients: false,
            modifyProviders: false,
            modifySales: false,
            modifyBuys: false,
            accessToStatistics: false,
            accessToBuys: false,
            accessToProviders: false,
          }
        });
      } else {
        reset({
          profileName: '',
          businessName: '',
          permissions: {
            modifyProducts: false,
            modifyClients: false,
            modifyProviders: false,
            modifySales: false,
            modifyBuys: false,
            accessToStatistics: false,
            accessToBuys: false,
            accessToProviders: false,
          }
        });
      }
    }
  }, [open, profile, reset]);

  const handleFormSubmit = async (data: ProfileFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {getDialogTitle()}
        {isFirstProfile && (
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
            Nombra tu perfil fundador, se recomienda que lleve el nombre de la empresa.
          </div>
        )}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <ProfileForm
            control={control}
            errors={errors}
            isReadOnly={isReadOnly}
            isFirstProfile={isFirstProfile}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            {isReadOnly ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!isReadOnly && (
            <Button type="submit" variant="contained">
              {mode === 'create' ? 'Crear Perfil' : 'Actualizar'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};
