import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Product } from '@/types/business';
import { ProductFormData, DialogMode } from '../types';
import { ProductForm } from './ProductForm';

interface ProductDialogProps {
  open: boolean;
  mode: DialogMode;
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  mode,
  product,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Product';
      case 'edit': return 'Edit Product';
      case 'view': return 'Product Details';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';

  // Reset form when dialog opens or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          description: product.description || '',
          price: product.price,
          cost: product.cost || 0,
          barcode: product.barcode || '',
          category: product.category,
          minStock: product.minStock || 0,
        });
      } else {
        reset();
      }
    }
  }, [open, product, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <ProductForm
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
