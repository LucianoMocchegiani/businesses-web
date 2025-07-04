import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ScreenContainer } from '@/components';
import { useSales } from './hooks';
import { SaleTable, SaleDialog } from './components';

export const SalesScreen: React.FC = () => {
  // Mock business ID - in a real app, this would come from auth context or route params
  const businessId = 'mock-business-id';

  const {
    // State
    sales,
    loading,
    dialogOpen,
    dialogMode,
    selectedSale,
    pagination,
    
    // Snackbar
    snackbar,
    hideSnackbar,
    
    // Actions
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCancel,
    handleCloseDialog,
    handleSubmit,
    handlePageChange,
    handlePageSizeChange,
  } = useSales(businessId);

  return (
    <ScreenContainer>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Sales 
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
        >
          New Sale
        </Button>
      </Box>

      <SaleTable
        sales={sales}
        loading={loading}
        pagination={pagination}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <SaleDialog
        open={dialogOpen}
        mode={dialogMode}
        sale={selectedSale}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
