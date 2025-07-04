import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ScreenContainer, SnackbarAlert } from '@/components';
import { useCustomers } from './hooks';
import { CustomerTable, CustomerDialog } from './components';

export const CustomersScreen: React.FC = () => {
  const {
    customers,
    loading,
    dialogOpen,
    dialogMode,
    selectedCustomer,
    snackbar,
    hideSnackbar,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseDialog,
    handleSubmit,
  } = useCustomers();

  return (
    <ScreenContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Customer
        </Button>
      </Box>

      <CustomerTable
        customers={customers}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomerDialog
        open={dialogOpen}
        mode={dialogMode}
        customer={selectedCustomer}
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
