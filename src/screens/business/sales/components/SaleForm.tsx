import React, { useState, useEffect } from 'react';
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
import { SaleFormData, SaleDetailFormData, DialogMode } from '../types';
import { SaleEntity } from '@/types/business';
import { BarcodeSearchInput, ProductSearchResult } from '@/components/BarcodeScanner';
import { ProductSearchService } from '@/services/productSearchService';

interface SaleFormProps {
  initialData?: SaleEntity | null;
  mode: DialogMode;
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
}

// Mock data for products and customers - in a real app, these would come from the backend
const mockProducts = [
  { id: '1', name: 'Laptop Dell', price: 150.00 },
  { id: '2', name: 'Mouse Inalámbrico', price: 25.00 },
  { id: '3', name: 'Teclado USB', price: 25.50 },
  { id: '4', name: 'Monitor 24"', price: 299.99 },
  { id: '5', name: 'Cable HDMI', price: 15.00 },
];

const mockCustomers = [
  { id: '1', name: 'Juan Pérez' },
  { id: '2', name: 'María García' },
  { id: '3', name: 'Carlos López' },
];

export const SaleForm: React.FC<SaleFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<SaleFormData>({
    customerId: '',
    customerName: '',
    totalAmount: 0,
    status: 'PENDING',
    saleDetails: [],
    notes: '',
  });

  const [newItem, setNewItem] = useState<Partial<SaleDetailFormData>>({
    productId: '',
    productName: '',
    quantity: 1,
    price: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId || '',
        customerName: initialData.customerName || '',
        totalAmount: initialData.totalAmount,
        status: initialData.status,
        saleDetails: initialData.saleDetails || [],
        notes: '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    // Calculate total when items change
    const total = formData.saleDetails.reduce((sum, item) => sum + item.totalAmount, 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.saleDetails]);

  useEffect(() => {
    // Calculate item total when quantity or price changes
    const total = (newItem.quantity || 0) * (newItem.price || 0);
    setNewItem(prev => ({ ...prev, totalAmount: total }));
  }, [newItem.quantity, newItem.price]);

  const handleInputChange = (field: keyof SaleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductSearch = async (query: string): Promise<ProductSearchResult[]> => {
    return await ProductSearchService.searchProducts(query);
  };

  const handleProductSelect = (product: ProductSearchResult) => {
    // Check if product is already in the list
    const existingItemIndex = formData.saleDetails.findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Increase quantity if product already exists
      const updatedDetails = [...formData.saleDetails];
      updatedDetails[existingItemIndex] = {
        ...updatedDetails[existingItemIndex],
        quantity: updatedDetails[existingItemIndex].quantity + 1,
        totalAmount: (updatedDetails[existingItemIndex].quantity + 1) * updatedDetails[existingItemIndex].price,
      };
      
      setFormData(prev => ({
        ...prev,
        saleDetails: updatedDetails,
      }));
    } else {
      // Add new product to the list
      const newSaleDetail: SaleDetailFormData = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        totalAmount: product.price,
      };

      setFormData(prev => ({
        ...prev,
        saleDetails: [...prev.saleDetails, newSaleDetail],
      }));
    }
  };

  const handleCustomerChange = (customer: any) => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customerName: '',
      }));
    }
  };

  const handleProductChange = (product: any) => {
    if (product) {
      setNewItem(prev => ({
        ...prev,
        productId: product.id,
        productName: product.name,
        price: product.price,
        totalAmount: (prev.quantity || 1) * product.price,
      }));
    } else {
      setNewItem({
        productId: '',
        productName: '',
        quantity: 1,
        price: 0,
        totalAmount: 0,
      });
    }
  };

  const handleAddItem = () => {
    if (newItem.productId && newItem.quantity && newItem.price) {
      const item: SaleDetailFormData = {
        productId: newItem.productId!,
        productName: newItem.productName!,
        quantity: newItem.quantity!,
        price: newItem.price!,
        totalAmount: newItem.totalAmount!,
      };

      setFormData(prev => ({
        ...prev,
        saleDetails: [...prev.saleDetails, item],
      }));

      setNewItem({
        productId: '',
        productName: '',
        quantity: 1,
        price: 0,
        totalAmount: 0,
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      saleDetails: prev.saleDetails.filter((_, i) => i !== index),
    }));
  };

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
            options={mockCustomers}
            getOptionLabel={(option) => option.name}
            value={mockCustomers.find(c => c.id === formData.customerId) || null}
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
                      options={mockProducts}
                      getOptionLabel={(option) => option.name}
                      value={mockProducts.find(p => p.id === newItem.productId) || null}
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
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
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
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
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
