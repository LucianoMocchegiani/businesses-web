import React from 'react';
import {
  Box,
  TextField,
  Grid,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { PurchaseFormData, DialogMode } from '../types';
import { PurchaseEntity } from '@/types/business';
import { BarcodeSearchInput } from '@/components/BarcodeScanner';
import { usePurchaseForm, useProducts, useSuppliers } from '../hooks';

interface PurchaseFormProps {
  mode: DialogMode;
  initialData?: PurchaseEntity;
  onSubmit: (data: PurchaseFormData) => void;
  onCancel: () => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    formData,
    newItem,
    handleInputChange,
    handleProductSearch,
    handleProductSelect,
    handleSupplierChange,
    handleProductChange,
    handleNewItemChange,
    handleAddItem,
    handleRemoveItem,
  } = usePurchaseForm({ initialData });

  const { products, loading: productsLoading } = useProducts();
  const { suppliers, loading: suppliersLoading } = useSuppliers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isReadOnly = mode === 'view';
  const canEdit = !isReadOnly && formData.status !== 'CANCELED';

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Purchase Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={suppliers}
            loading={suppliersLoading}
            getOptionLabel={(option) => option.supplier_name}
            value={suppliers.find(s => s.supplier_id === formData.supplier_id) || null}
            onChange={(_, value) => handleSupplierChange(value)}
            disabled={isReadOnly || !canEdit}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier"
                placeholder="Select a supplier"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Custom Supplier Name"
            value={formData.supplier_name}
            onChange={(e) => handleInputChange('supplier_name', e.target.value)}
            disabled={isReadOnly || !canEdit || !!formData.supplier_id}
            fullWidth
            helperText="Use this for walk-in suppliers or override selected supplier name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Status"
            select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            disabled={isReadOnly || !canEdit}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="ORDERED">Ordered</MenuItem>
            <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
            <MenuItem value="RECEIVED">Received</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Total Amount"
            value={
              isNaN(Number(formData.total_amount))
                ? 'N/A'
                : `$${Number(formData.total_amount).toFixed(2)}`
            }
            disabled
            fullWidth
          />
        </Grid>

        {/* Barcode Scanner Section */}
        {canEdit && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CartIcon color="primary" />
                  <Typography variant="h6">
                    Agregar Productos por Código de Barras
                  </Typography>
                </Box>
                <BarcodeSearchInput
                  onProductSelect={handleProductSelect}
                  onSearch={handleProductSearch}
                  placeholder="Escanea código de barras o busca por nombre..."
                  label="Buscar Producto"
                  autoFocus={true}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  💡 Tip: Usa un lector de código de barras o escribe el código manualmente. Presiona Enter para buscar.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary">
              O agregar manualmente
            </Typography>
          </Divider>
        </Grid>

        {/* Add New Item Section */}
        {canEdit && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Item
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={products}
                      loading={productsLoading}
                      getOptionLabel={(option) => option.product_name || ''}
                      value={products.find(p => p.product_id === newItem.product_id) || null}
                      onChange={(_, value) => handleProductChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Product"
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={newItem.quantity_ordered || ''}
                      onChange={(e) => handleNewItemChange('quantity_ordered', Number(e.target.value))}
                      size="small"
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Price"
                      type="number"
                      value={newItem.price || ''}
                      onChange={(e) => handleNewItemChange('price', Number(e.target.value))}
                      size="small"
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Total"
                      value={`$${newItem.total_amount?.toFixed(2) || '0.00'}`}
                      disabled
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Button
                      variant="contained"
                      onClick={handleAddItem}
                      disabled={!newItem.product_id || !newItem.quantity_ordered || !newItem.price}
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Items Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Purchase Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      {canEdit && <TableCell align="center">Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.purchaseDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 5 : 4} align="center">
                          No items added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.purchaseDetails.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product_name || item.businessProduct?.product_name || item.globalProduct?.product_name || 'N/A'}</TableCell>
                          <TableCell align="right">{item.quantity_ordered}</TableCell>
                          <TableCell align="right">
                            {isNaN(Number(item.price)) ? 'N/A' : `$${Number(item.price).toFixed(2)}`}
                          </TableCell>
                          <TableCell align="right">
                            {isNaN(Number(item.total_amount)) ? 'N/A' : `$${Number(item.total_amount).toFixed(2)}`}
                          </TableCell>
                          {canEdit && (
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(index)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Actions */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onCancel}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isReadOnly && canEdit && (
              <Button
                type="submit"
                variant="contained"
                disabled={formData.purchaseDetails.length === 0}
              >
                {mode === 'create' ? 'Create Purchase' : 'Update Purchase'}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
