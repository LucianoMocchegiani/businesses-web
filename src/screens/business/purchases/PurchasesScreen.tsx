import React from 'react';
import { Box, Button, Typography, Alert, Snackbar } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ScreenContainer } from '@/components';
import { PurchaseTable, PurchaseDialog } from './components';
import { usePurchases } from './hooks';

export const PurchasesScreen: React.FC = () => {
  const {
    // State
    purchases,
    loading,
    dialogOpen,
    dialogMode,
    selectedPurchase,
    
    // Snackbar
    snackbar,
    hideSnackbar,
    
    // Actions
    handleCreate,
    handleView,
    handleCancel,
    handleCloseDialog,
    handleSubmit,
  } = usePurchases();

  return (
    <ScreenContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Purchases
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          New Purchase
        </Button>
      </Box>

      <PurchaseTable
        purchases={purchases}
        loading={loading}
        onView={handleView}
        onCancel={handleCancel}
      />

      <PurchaseDialog
        open={dialogOpen}
        mode={dialogMode}
        purchase={selectedPurchase}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenContainer>
  );
};
