import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PurchaseEntity } from '@/types/business';
import { ReceivePurchaseRequest } from '@/services/purchaseService';

interface ReceivePurchaseDialogProps {
  open: boolean;
  purchase: PurchaseEntity | null;
  onClose: () => void;
  onReceive: (request: ReceivePurchaseRequest) => Promise<void>;
}

export const ReceivePurchaseDialog: React.FC<ReceivePurchaseDialogProps> = ({
  open,
  purchase,
  onClose,
  onReceive,
}) => {
  const [actualDeliveryDate, setActualDeliveryDate] = useState<Date>(new Date());
  const [receivedBy, setReceivedBy] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para cada producto
  const [productDetails, setProductDetails] = useState<{
    [productId: string]: {
      quantityReceived: number;
      qualityCheck: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
      qualityNotes: string;
      lotNumber: string;
      expirationDate: Date | null;
      warehouseLocation: string;
    };
  }>({});

  // Inicializar detalles de productos cuando se abre el diálogo
  React.useEffect(() => {
    if (purchase && open) {
      const initialDetails: typeof productDetails = {};
      purchase.purchaseDetails.forEach(detail => {
        initialDetails[detail.productId] = {
          quantityReceived: detail.quantity,
          qualityCheck: 'APPROVED',
          qualityNotes: '',
          lotNumber: detail.lotNumber || generateLotNumber(detail.productId),
          expirationDate: detail.expirationDate ? new Date(detail.expirationDate) : null,
          warehouseLocation: 'A-1-1',
        };
      });
      setProductDetails(initialDetails);
      setReceivedBy('');
      setGeneralNotes('');
    }
  }, [purchase, open]);

  const updateProductDetail = (productId: string, field: string, value: any) => {
    setProductDetails(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const generateLotNumber = (productId: string): string => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const productCode = productId.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `LOT${dateStr}${productCode}${random}`;
  };

  const handleReceive = async () => {
    if (!purchase || !receivedBy.trim()) return;

    try {
      setLoading(true);

      const request: ReceivePurchaseRequest = {
        purchaseId: purchase.id,
        receivedBy: receivedBy.trim(),
        actualDeliveryDate,
        purchaseDetails: purchase.purchaseDetails.map(detail => ({
          productId: detail.productId,
          quantityReceived: productDetails[detail.productId]?.quantityReceived || detail.quantity,
          qualityCheck: productDetails[detail.productId]?.qualityCheck || 'APPROVED',
          qualityNotes: productDetails[detail.productId]?.qualityNotes,
          lotNumber: productDetails[detail.productId]?.lotNumber,
          expirationDate: productDetails[detail.productId]?.expirationDate || undefined,
          warehouseLocation: productDetails[detail.productId]?.warehouseLocation,
        })),
        generalNotes: generalNotes.trim() || undefined,
      };

      await onReceive(request);
      onClose();
    } catch (error) {
      console.error('Error receiving purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  const canReceive = purchase?.status === 'ORDERED' || purchase?.status === 'IN_TRANSIT';
  const totalOrdered = purchase?.purchaseDetails.reduce((sum, detail) => sum + detail.quantity, 0) || 0;
  const totalReceived = Object.values(productDetails).reduce((sum, detail) => sum + detail.quantityReceived, 0);

  if (!purchase) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Receive Purchase - {purchase.supplierName}
          </Typography>
          <Chip 
            label={purchase.status} 
            color={canReceive ? 'warning' : 'default'}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        {!canReceive && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This purchase cannot be received in its current status: {purchase.status}
          </Alert>
        )}

        {/* Información general de recepción */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Reception Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <DatePicker
              label="Actual Delivery Date"
              value={actualDeliveryDate}
              onChange={(date) => setActualDeliveryDate(date || new Date())}
            />
            <TextField
              label="Received By"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              required
              fullWidth
            />
          </Box>
          <TextField
            label="General Notes"
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Resumen de cantidades */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Quantity Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Typography variant="body2">
              <strong>Ordered:</strong> {totalOrdered} units
            </Typography>
            <Typography variant="body2">
              <strong>Receiving:</strong> {totalReceived} units
            </Typography>
            <Typography 
              variant="body2" 
              color={totalReceived === totalOrdered ? 'success.main' : 'warning.main'}
            >
              <strong>Difference:</strong> {totalReceived - totalOrdered} units
            </Typography>
          </Box>
        </Box>

        {/* Tabla de productos */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Ordered</TableCell>
                <TableCell align="right">Received</TableCell>
                <TableCell>Quality</TableCell>
                <TableCell>Lot Number</TableCell>
                <TableCell>Expiration</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchase.purchaseDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {detail.productName}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography variant="body2">
                      {detail.quantity}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={productDetails[detail.productId]?.quantityReceived || detail.quantity}
                      onChange={(e) => updateProductDetail(
                        detail.productId, 
                        'quantityReceived', 
                        Number(e.target.value)
                      )}
                      inputProps={{ min: 0, max: detail.quantity * 1.1 }}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={productDetails[detail.productId]?.qualityCheck || 'APPROVED'}
                        onChange={(e) => updateProductDetail(
                          detail.productId, 
                          'qualityCheck', 
                          e.target.value
                        )}
                      >
                        <MenuItem value="APPROVED">✅ Approved</MenuItem>
                        <MenuItem value="PARTIALLY_APPROVED">⚠️ Partial</MenuItem>
                        <MenuItem value="REJECTED">❌ Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  
                  <TableCell>
                    <TextField
                      size="small"
                      value={productDetails[detail.productId]?.lotNumber || ''}
                      onChange={(e) => updateProductDetail(
                        detail.productId, 
                        'lotNumber', 
                        e.target.value
                      )}
                      sx={{ width: 120 }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <DatePicker
                      label=""
                      value={productDetails[detail.productId]?.expirationDate}
                      onChange={(date) => updateProductDetail(
                        detail.productId, 
                        'expirationDate', 
                        date
                      )}
                      slotProps={{ textField: { size: 'small', sx: { width: 140 } } }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="A-1-1"
                      value={productDetails[detail.productId]?.warehouseLocation || ''}
                      onChange={(e) => updateProductDetail(
                        detail.productId, 
                        'warehouseLocation', 
                        e.target.value
                      )}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleReceive}
          variant="contained"
          disabled={!canReceive || !receivedBy.trim() || loading}
          color="primary"
        >
          {loading ? 'Receiving...' : 'Receive Purchase'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
