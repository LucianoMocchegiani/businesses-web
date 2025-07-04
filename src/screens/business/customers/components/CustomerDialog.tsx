import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Customer } from '@/types/business';
import { CustomerFormData, DialogMode } from '../types';
import { CustomerForm } from './CustomerForm';

interface CustomerDialogProps {
  open: boolean;
  mode: DialogMode;
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
}

export const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  mode,
  customer,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormData>();

  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Customer';
      case 'edit': return 'Edit Customer';
      case 'view': return 'Customer Details';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';

  // Reset form when dialog opens or customer changes
  useEffect(() => {
    if (open) {
      if (customer) {
        reset({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          taxId: customer.taxId || '',
          notes: customer.notes || '',
        });
      } else {
        reset();
      }
    }
  }, [open, customer, reset]);

  const handleFormSubmit = async (data: CustomerFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <CustomerForm
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
