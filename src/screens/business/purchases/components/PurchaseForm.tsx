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
import { ProductSearchService } from '@/services/productSearchService';

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
    supplierName: '',
    totalAmount: 0,
    status: 'PENDING',
    purchaseDetails: [
      {
        productId: '',
        productName: '',
        quantityOrdered: 1,
        price: 0,
        lotNumber: '',
        entryDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
      }
    ],
  });

  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (initialData) {
      setFormData({
        supplierId: initialData.supplierId,
        supplierName: initialData.supplierName || '',
        totalAmount: initialData.totalAmount,
        status: initialData.status,
        purchaseDetails: initialData.purchaseDetails.map(detail => ({
          productId: detail.productId,
          productName: detail.productName,
          quantityOrdered: detail.quantity,
          price: detail.price,
          totalAmount: detail.totalAmount,
          lotNumber: detail.lotNumber || '',
          entryDate: detail.entryDate ? detail.entryDate.split('T')[0] : '',
          expirationDate: detail.expirationDate ? detail.expirationDate.split('T')[0] : '',
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
    return await ProductSearchService.searchProducts(query);
  };

  const handleProductSelect = (product: ProductSearchResult) => {
    // Check if product is already in the list
    const existingItemIndex = formData.purchaseDetails.findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Increase quantity if product already exists
      const updatedDetails = [...formData.purchaseDetails];
      updatedDetails[existingItemIndex] = {
        ...updatedDetails[existingItemIndex],
        quantityOrdered: updatedDetails[existingItemIndex].quantityOrdered + 1,
        totalAmount: (updatedDetails[existingItemIndex].quantityOrdered + 1) * updatedDetails[existingItemIndex].price,
      };
      
      setFormData(prev => ({
        ...prev,
        purchaseDetails: updatedDetails,
      }));
    } else {
      // Add new product to the list
      const newPurchaseDetail: PurchaseDetailFormData = {
        productId: product.id,
        productName: product.name,
        quantityOrdered: 1,
        price: product.price,
        totalAmount: product.price,
        lotNumber: '',
        entryDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
      };

      setFormData(prev => ({
        ...prev,
        purchaseDetails: [...prev.purchaseDetails, newPurchaseDetail],
      }));
    }

    // Recalculate total
    const totalAmount = formData.purchaseDetails.reduce((sum, detail) => sum + (detail.totalAmount || 0), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount,
    }));
  };

  const handleDetailChange = (index: number, field: keyof PurchaseDetailFormData, value: any) => {
    const updatedDetails = [...formData.purchaseDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };

    // Auto-calculate total amount for the detail
    if (field === 'quantityOrdered' || field === 'price') {
      const detail = updatedDetails[index];
      detail.totalAmount = detail.quantityOrdered * detail.price;
    }

    setFormData(prev => ({
      ...prev,
      purchaseDetails: updatedDetails,
    }));

    // Auto-calculate total amount for the purchase
    const totalAmount = updatedDetails.reduce((sum, detail) => sum + (detail.totalAmount || 0), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount,
    }));
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      purchaseDetails: [
        ...prev.purchaseDetails,
        {
          productId: '',
          productName: '',
          quantityOrdered: 1,
          price: 0,
          lotNumber: '',
          entryDate: new Date().toISOString().split('T')[0],
          expirationDate: '',
        }
      ],
    }));
  };

  const removeDetail = (index: number) => {
    if (formData.purchaseDetails.length > 1) {
      const updatedDetails = formData.purchaseDetails.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        purchaseDetails: updatedDetails,
      }));

      // Recalculate total amount
      const totalAmount = updatedDetails.reduce((sum, detail) => sum + (detail.totalAmount || 0), 0);
      setFormData(prev => ({
        ...prev,
        totalAmount,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    return (formData.supplierName?.trim() || '') !== '' &&
           formData.purchaseDetails.length > 0 &&
           formData.purchaseDetails.every(detail => 
             detail.productName.trim() !== '' &&
             detail.quantityOrdered > 0 &&
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
            value={formData.supplierName}
            onChange={(e) => handleChange('supplierName', e.target.value)}
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
            value={formData.totalAmount}
            onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
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
                    {formData.purchaseDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size="small"
                            value={detail.productName}
                            onChange={(e) => handleDetailChange(index, 'productName', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Product name"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={detail.quantityOrdered}
                            onChange={(e) => handleDetailChange(index, 'quantityOrdered', parseInt(e.target.value) || 0)}
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
                          ${(detail.totalAmount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={detail.lotNumber}
                            onChange={(e) => handleDetailChange(index, 'lotNumber', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="LOT-XXX"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            value={detail.entryDate}
                            onChange={(e) => handleDetailChange(index, 'entryDate', e.target.value)}
                            disabled={isReadOnly}
                            sx={{ width: 140 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            value={detail.expirationDate}
                            onChange={(e) => handleDetailChange(index, 'expirationDate', e.target.value)}
                            disabled={isReadOnly}
                            sx={{ width: 140 }}
                          />
                        </TableCell>
                        {!isReadOnly && (
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => removeDetail(index)}
                              disabled={formData.purchaseDetails.length === 1}
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
