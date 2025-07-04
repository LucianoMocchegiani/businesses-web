import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { SupplierEntity } from '@/types/business';
import { SupplierFormData, DialogMode } from '../types';
import { SupplierForm } from './SupplierForm';

interface SupplierDialogProps {
  open: boolean;
  mode: DialogMode;
  supplier: SupplierEntity | null;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => Promise<void>;
}

export const SupplierDialog: React.FC<SupplierDialogProps> = ({
  open,
  mode,
  supplier,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormData>();

  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Supplier';
      case 'edit': return 'Edit Supplier';
      case 'view': return 'Supplier Details';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';

  // Reset form when dialog opens or supplier changes
  useEffect(() => {
    if (open) {
      if (supplier) {
        reset({
          name: supplier.name,
          contactName: supplier.contactName || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          taxId: supplier.taxId || '',
          notes: supplier.notes || '',
        });
      } else {
        reset();
      }
    }
  }, [open, supplier, reset]);

  const handleFormSubmit = async (data: SupplierFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <SupplierForm
            control={control}
            errors={errors}
            isReadOnly={isReadOnly}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button type="submit" variant="contained">
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};
