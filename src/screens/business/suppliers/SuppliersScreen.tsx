import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ScreenContainer, SnackbarAlert } from '@/components';
import { useSuppliers } from './hooks';
import { SupplierTable, SupplierDialog } from './components';

export const SuppliersScreen: React.FC = () => {
  const {
    suppliers,
    loading,
    dialogOpen,
    dialogMode,
    selectedSupplier,
    snackbar,
    hideSnackbar,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseDialog,
    handleSubmit,
  } = useSuppliers();

  return (
    <ScreenContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Suppliers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Supplier
        </Button>
      </Box>

      <SupplierTable
        suppliers={suppliers}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SupplierDialog
        open={dialogOpen}
        mode={dialogMode}
        supplier={selectedSupplier}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <SnackbarAlert
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </ScreenContainer>
  );
};
