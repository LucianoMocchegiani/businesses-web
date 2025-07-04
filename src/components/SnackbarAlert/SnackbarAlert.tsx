import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarState } from '@/hooks/useSnackbar';

interface SnackbarAlertProps {
  snackbar: SnackbarState;
  onClose: () => void;
  autoHideDuration?: number;
}

export const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  snackbar,
  onClose,
  autoHideDuration = 6000,
}) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
