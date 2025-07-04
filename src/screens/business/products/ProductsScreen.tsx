import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ScreenContainer, SnackbarAlert } from '@/components';
import { useProducts } from './hooks';
import { ProductTable, ProductDialog } from './components';

export const ProductsScreen: React.FC = () => {
  const {
    products,
    loading,
    dialogOpen,
    dialogMode,
    selectedProduct,
    snackbar,
    hideSnackbar,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseDialog,
    handleSubmit,
  } = useProducts();

  return (
    <ScreenContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Product
        </Button>
      </Box>

      <ProductTable
        products={products}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDialog
        open={dialogOpen}
        mode={dialogMode}
        product={selectedProduct}
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
