import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SaleForm } from './SaleForm';
import { SaleFormData, DialogMode } from '../types';
import { SaleEntity } from '@/types/business';

interface SaleDialogProps {
  open: boolean;
  mode: DialogMode;
  sale?: SaleEntity | null;
  onClose: () => void;
  onSubmit: (data: SaleFormData) => void;
}

export const SaleDialog: React.FC<SaleDialogProps> = ({
  open,
  mode,
  sale,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Sale';
      case 'edit':
        return 'Edit Sale';
      case 'view':
        return 'View Sale Details';
      default:
        return 'Sale';
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
        <SaleForm
          initialData={sale}
          mode={mode}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>

      {mode === 'view' && (
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
