import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Autocomplete,
  Box,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { SaleFormData, DialogMode } from '../types';
import { SaleEntity } from '@/types/business';
import { BarcodeSearchInput } from '@/components/BarcodeScanner';
import { useProducts, useSaleForm, useCustomers } from '../hooks';

interface SaleFormProps {
  initialData?: SaleEntity | null;
  mode: DialogMode;
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
}) => {

  const {
    formData,
    newItem,
    handleInputChange,
    handleProductSearch,
    handleProductSelect,
    handleCustomerChange,
    handleProductChange,
    handleNewItemChange,
    handleAddItem,
    handleRemoveItem,
  } = useSaleForm({ initialData });

  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isReadOnly = mode === 'view';
  const canEdit = !isReadOnly && formData.status !== 'CANCELED';


  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Customer Selection */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={customers}
            loading={customersLoading}
            getOptionLabel={(option) => option.name}
            value={customers.find(c => c.id === formData.customerId) || null}
            onChange={(_, value) => handleCustomerChange(value)}
            disabled={isReadOnly || !canEdit}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                placeholder="Select a customer or leave empty for walk-in"
              />
            )}
          />
        </Grid>

        {/* Custom Customer Name */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Custom Customer Name"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            disabled={isReadOnly || !canEdit || !!formData.customerId}
            fullWidth
            helperText="Use this for walk-in customers or override selected customer name"
          />
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth disabled={isReadOnly || !canEdit}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELED">Canceled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Total Amount (Read-only, calculated) */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Amount"
            value={`$${formData.totalAmount?.toFixed(2) || '0.00'}`}
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
                      getOptionLabel={(option) => option.name}
                      value={products.find(p => p.id === newItem.productId) || null}
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
                      value={newItem.quantity || ''}
                      onChange={(e) => handleNewItemChange('quantity', Number(e.target.value))}
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
                      value={`$${newItem.totalAmount?.toFixed(2) || '0.00'}`}
                      disabled
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <Button
                      variant="contained"
                      onClick={handleAddItem}
                      disabled={!newItem.productId || !newItem.quantity || !newItem.price}
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
                Sale Items
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
                    {formData.saleDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={canEdit ? 5 : 4} align="center">
                          No items added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.saleDetails.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">${item.totalAmount.toFixed(2)}</TableCell>
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
                disabled={formData.saleDetails.length === 0}
              >
                {mode === 'create' ? 'Create Sale' : 'Update Sale'}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};
