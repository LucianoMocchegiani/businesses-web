import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

  const getDialogWidth = () => {
    return mode === 'view' ? 'lg' : 'xl';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={getDialogWidth()}
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          minHeight: fullScreen ? '100vh' : '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
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

      <DialogContent dividers sx={{ p: 3 }}>
        <PurchaseForm
          initialData={purchase || undefined}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
