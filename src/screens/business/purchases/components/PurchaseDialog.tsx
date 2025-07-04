import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PurchaseForm } from './PurchaseForm';
import { PurchaseFormData, DialogMode } from '../types';
import { PurchaseEntity } from '@/types/business';

interface PurchaseDialogProps {
  open: boolean;
  mode: DialogMode;
  purchase?: PurchaseEntity | null;
  onClose: () => void;
  onSubmit: (data: PurchaseFormData) => void;
}

export const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  open,
  mode,
  purchase,
  onClose,
  onSubmit,
}) => {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Purchase';
      case 'edit':
        return 'Edit Purchase';
      case 'view':
        return 'View Purchase Details';
      default:
        return 'Purchase';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {getTitle()}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <PurchaseForm
          mode={mode}
          initialData={purchase || undefined}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
