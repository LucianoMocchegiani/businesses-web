import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { PurchaseFormData, PurchaseDetailFormData, DialogMode } from '../types';
import { PurchaseEntity } from '@/types/business';
import { BarcodeSearchInput, ProductSearchResult } from '@/components/BarcodeScanner';
import { productSearchService } from '@/services/productSearchService';

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
  const [formData, setFormData] = useState<PurchaseFormData>({
    supplier_name: '',
    total_amount: 0,
    status: 'PENDING',
    purchase_details: [
      {
        product_id: '',
        product_name: '',
        quantity_ordered: 1,
        price: 0,
        lot_number: '',
        entry_date: new Date().toISOString().split('T')[0],
        expiration_date: '',
      }
    ],
  });

  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (initialData) {
      setFormData({
        supplier_id: initialData.supplier_id,
        supplier_name: initialData.supplier_name || '',
        total_amount: initialData.total_amount,
        status: initialData.status,
        purchase_details: initialData.purchase_details.map(detail => ({
          product_id: detail.product_id,
          product_name: detail.product_name,
          quantity_ordered: detail.quantity,
          price: detail.price,
          total_amount: detail.total_amount,
          lot_number: detail.lot_number || '',
          entry_date: detail.entry_date ? detail.entry_date.split('T')[0] : '',
          expiration_date: detail.expiration_date ? detail.expiration_date.split('T')[0] : '',
        })),
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof PurchaseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductSearch = async (query: string): Promise<ProductSearchResult[]> => {
    return await productSearchService.searchProducts(query);
  };

  const handleProductSelect = (product: ProductSearchResult) => {
    // Check if product is already in the list
    const existingItemIndex = formData.purchase_details.findIndex(
      item => item.product_id === product.id
    );

    if (existingItemIndex >= 0) {
      // Increase quantity if product already exists
      const updatedDetails = [...formData.purchase_details];
      updatedDetails[existingItemIndex] = {
        ...updatedDetails[existingItemIndex],
        quantity_ordered: updatedDetails[existingItemIndex].quantity_ordered + 1,
        total_amount: (updatedDetails[existingItemIndex].quantity_ordered + 1) * updatedDetails[existingItemIndex].price,
      };
      
      setFormData(prev => ({
        ...prev,
        purchase_details: updatedDetails,
      }));
    } else {
      // Add new product to the list
      const newPurchaseDetail: PurchaseDetailFormData = {
        product_id: product.id,
        product_name: product.name,
        quantity_ordered: 1,
        price: product.price,
        total_amount: product.price,
        lot_number: '',
        entry_date: new Date().toISOString().split('T')[0],
        expiration_date: '',
      };

      setFormData(prev => ({
        ...prev,
        purchase_details: [...prev.purchase_details, newPurchaseDetail],
      }));
    }

    // Recalculate total
    const totalAmount = formData.purchase_details.reduce((sum, detail) => sum + (detail.total_amount || 0), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount,
    }));
  };

  const handleDetailChange = (index: number, field: keyof PurchaseDetailFormData, value: any) => {
    const updatedDetails = [...formData.purchase_details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };

    // Auto-calculate total amount for the detail
    if (field === 'quantity_ordered' || field === 'price') {
      const detail = updatedDetails[index];
      detail.total_amount = detail.quantity_ordered * detail.price;
    }

    setFormData(prev => ({
      ...prev,
      purchase_details: updatedDetails,
    }));

    // Auto-calculate total amount for the purchase
    const totalAmount = updatedDetails.reduce((sum, detail) => sum + (detail.total_amount || 0), 0);
    setFormData(prev => ({
      ...prev,
      total_amount: totalAmount,
    }));
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      purchase_details: [
        ...prev.purchase_details,
        {
          product_id: '',
          product_name: '',
          quantity_ordered: 1,
          price: 0,
          lot_number: '',
          entry_date: new Date().toISOString().split('T')[0],
          expiration_date: '',
        }
      ],
    }));
  };

  const removeDetail = (index: number) => {
    if (formData.purchase_details.length > 1) {
      const updatedDetails = formData.purchase_details.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        purchase_details: updatedDetails,
      }));

      // Recalculate total amount
      const totalAmount = updatedDetails.reduce((sum, detail) => sum + (detail.total_amount || 0), 0);
      setFormData(prev => ({
        ...prev,
        total_amount: totalAmount,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return (formData.supplier_name?.trim() || '') !== '' &&
           formData.purchase_details.length > 0 &&
           formData.purchase_details.every(detail => 
             detail.product_name.trim() !== '' &&
             detail.quantity_ordered > 0 &&
             detail.price >= 0
           );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 800 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Purchase Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Supplier Name"
            value={formData.supplier_name}
            onChange={(e) => handleChange('supplier_name', e.target.value)}
            disabled={isReadOnly}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Status"
            select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={isReadOnly}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Amount"
            type="number"
            value={formData.total_amount}
            onChange={(e) => handleChange('total_amount', parseFloat(e.target.value) || 0)}
            disabled={true} // Always calculated automatically
            InputProps={{
              startAdornment: '$',
            }}
          />
        </Grid>

        {/* Barcode Scanner Section */}
        {!isReadOnly && (
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ my: 2 }}>
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

        {/* Purchase Details */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Purchase Details
            </Typography>
            {!isReadOnly && (
              <Button
                startIcon={<AddIcon />}
                onClick={addDetail}
                variant="outlined"
                size="small"
              >
                Add Item
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Lot Number</TableCell>
                      <TableCell>Entry Date</TableCell>
                      <TableCell>Expiration</TableCell>
                      {!isReadOnly && <TableCell>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.purchase_details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            value={detail.product_name}
                            onChange={(e) => handleDetailChange(index, 'product_name', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Product name"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={detail.quantity_ordered}
                            onChange={(e) => handleDetailChange(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                            disabled={isReadOnly}
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={detail.price}
                            onChange={(e) => handleDetailChange(index, 'price', parseFloat(e.target.value) || 0)}
                            disabled={isReadOnly}
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          ${(detail.total_amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={detail.lot_number}
                            onChange={(e) => handleDetailChange(index, 'lot_number', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="LOT-XXX"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            value={detail.entry_date}
                            onChange={(e) => handleDetailChange(index, 'entry_date', e.target.value)}
                            disabled={isReadOnly}
                            sx={{ width: 140 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            value={detail.expiration_date}
                            onChange={(e) => handleDetailChange(index, 'expiration_date', e.target.value)}
                            disabled={isReadOnly}
                            sx={{ width: 140 }}
                          />
                        </TableCell>
                        {!isReadOnly && (
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => removeDetail(index)}
                              disabled={formData.purchase_details.length === 1}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button onClick={onCancel}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </Button>
            {!isReadOnly && (
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid()}
              >
                {mode === 'create' ? 'Create Purchase' : 'Update Purchase'}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
